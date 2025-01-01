using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using App.Repositories.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace App.Services.Auth;

public class TokenService : ITokenService
{
    private readonly CustomTokenOption tokenOption;
    private readonly UserManager<User> userManager;
    
    public TokenService(IOptions<CustomTokenOption> options, UserManager<User> _userManager)
    {
        tokenOption = options.Value;
        userManager = _userManager;
    }
    
    public async Task<IEnumerable<Claim>> GetClaims(User user)
    {

        var roles = await userManager.GetRolesAsync(user);
        var userClaims = new List<Claim>()
        {
            new Claim(ClaimTypes.Name,user.UserName),
            new Claim(ClaimTypes.NameIdentifier,user.Id),
            new Claim(ClaimTypes.Email,user.Email),


        };
        userClaims.AddRange(roles.Select(x => new Claim(ClaimTypes.Role, x)));
        return userClaims;
    }
    
    public async Task<TokenDto> CreateTokenAsync(User user)
    {
        SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenOption.SecurityKey));
        var accessTokenExpiration = DateTime.Now.AddMinutes(tokenOption.AccessTokenExpiration);
        var refreshTokenExpiration = DateTime.Now.AddMinutes(tokenOption.RefreshTokenExpiration);

        //token imzalama 
        var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken jwtSecurityToken = new JwtSecurityToken(
            issuer: tokenOption.Issuer,
            audience: tokenOption.Audience,
            expires: accessTokenExpiration,
            signingCredentials: signingCredentials,
            notBefore: DateTime.Now,
            claims: await GetClaims(user)
        );

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.WriteToken(jwtSecurityToken);

        return new TokenDto()
        {
            AccessToken = token,
            RefreshToken = CreateRefreshToken(),
            AccessTokenExpiration = accessTokenExpiration,
            RefreshTokenExpiration = refreshTokenExpiration
        };
    }
    
    public string CreateRefreshToken()
    {
        byte[] number = new byte[32];
        using (RandomNumberGenerator random = RandomNumberGenerator.Create())
        {
            random.GetBytes(number);
            return Convert.ToBase64String(number);
        }
    }
}