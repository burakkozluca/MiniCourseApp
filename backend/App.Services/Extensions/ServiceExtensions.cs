using System.Reflection;
using System.Text;
using App.Services.Admin;
using App.Services.Auth;
using App.Services.Categories;
using App.Services.Courses;
using App.Services.Users;
using FluentValidation;
using FluentValidation.AspNetCore;
using App.Services.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using App.Services.UserCourses;
using App.Repositories;
using StackExchange.Redis;
using App.Services.Cart;

namespace App.Services.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<ICourseService, CourseService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<ITokenService,TokenService>();
        services.AddScoped<IAuthenticationService,AuthenticationService>();
        services.AddScoped<IFileService,FileService>();
        services.AddScoped<IUserCourseService, UserCourseService>();
        services.AddScoped<IUserCourseRepository, UserCourseRepository>();
        
        services.AddSingleton(sp =>
        {

                
            var smtpSettings = configuration.GetSection("SmtpSettings");
            return new MailService(
             
                smtpSettings["Server"],
                int.Parse(smtpSettings["Port"]),
                smtpSettings["User"],
                smtpSettings["Password"]
            );
        });
        
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        
        services.Configure<CustomTokenOption>(configuration.GetSection("TokenOption"));
        
        services.AddAuthentication(option =>
        {
            option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

        }).AddJwtBearer(opt =>
        {
            CustomTokenOption tokenOption = configuration.GetSection("TokenOption").Get<CustomTokenOption>();

            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenOption.SecurityKey));
            opt.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidAudience = tokenOption.Audience,
                ValidIssuer = tokenOption.Issuer,
                IssuerSigningKey = securityKey,
                ClockSkew = TimeSpan.Zero,



            };
        });
        
        services.AddSingleton<IConnectionMultiplexer>(opt => 
            ConnectionMultiplexer.Connect(configuration.GetConnectionString("Redis")));
        services.AddScoped<IRedisCartService, RedisCartService>();

        return services;
    }
}