using System.Net;
using App.Repositories;
using App.Repositories.Users;
using App.Services.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace App.Services.Auth;

public class AuthenticationService
(
    UserManager<User> userManager,
    ITokenService tokenService,
    IGenericRepository<UserRefreshToken> userRefreshTokenService,
    IUnitOfWork unitOfWork,
    MailService mailService
)
: IAuthenticationService
{
    public async Task<ServiceResult<TokenDto>> CreateTokenAsync(LoginDto loginDto)// fluent valide ile kontrol et
    {
        var user = await userManager.FindByEmailAsync(loginDto.email);

        if (user == null) return ServiceResult<TokenDto>.Fail("Email veya şifreye ait kullanıcı bulunamadı", System.Net.HttpStatusCode.NotFound);

        var userPasswordCheck = await userManager.CheckPasswordAsync(user, loginDto.password);

        if (!userPasswordCheck) return ServiceResult<TokenDto>.Fail("Email veya şifreye ait kullanıcı bulunamadı", System.Net.HttpStatusCode.NotFound);

        var token = await tokenService.CreateTokenAsync(user);

        var userRefreshToken = userRefreshTokenService.Where(x => x.UserId == user.Id).SingleOrDefault();

        if (userRefreshToken == null)
        {
            await userRefreshTokenService.AddAsync(new UserRefreshToken()
            {
                UserId = user.Id,
                Code = token.RefreshToken,
                Expiration = token.RefreshTokenExpiration
            });
        }
        else
        {
            userRefreshToken.Code = token.RefreshToken;
            userRefreshToken.Expiration = token.RefreshTokenExpiration;
        }

        await unitOfWork.SaveChangesAsync();

        return ServiceResult<TokenDto>.Success(token);
    }
    
    public async Task<ServiceResult<TokenDto>> CreateTokenByRefreshTokenAsync(string refreshToken)
    {
        var userRefreshToken = userRefreshTokenService.Where(x => x.Code == refreshToken).SingleOrDefault();

        if (userRefreshToken == null) return ServiceResult<TokenDto>.Fail("token bulunamadı", System.Net.HttpStatusCode.NotFound);

        if (userRefreshToken.Expiration <= DateTime.Now) return ServiceResult<TokenDto>.Fail("Refresh token has expired", System.Net.HttpStatusCode.Unauthorized);

        var user = await userManager.FindByIdAsync(userRefreshToken.UserId);

        if (user == null) return ServiceResult<TokenDto>.Fail("kullanıcı bulunamadı", System.Net.HttpStatusCode.NotFound);

        var token = await tokenService.CreateTokenAsync(user);

        userRefreshToken.Code = token.RefreshToken;
        userRefreshToken.Expiration = token.RefreshTokenExpiration;
        await unitOfWork.SaveChangesAsync();

        return ServiceResult<TokenDto>.Success(token);


    }
    
    public async Task<ServiceResult> RevokeRefreshToken(string refreshToken)
    {
        var existRefreshToken = await userRefreshTokenService.Where(x => x.Code == refreshToken).SingleOrDefaultAsync();

        if (existRefreshToken == null) return ServiceResult.Fail("token bulunamadı", System.Net.HttpStatusCode.NotFound);

        userRefreshTokenService.Delete(existRefreshToken);

        await unitOfWork.SaveChangesAsync();

        return ServiceResult.Success(HttpStatusCode.NoContent);
    }
    
    public async Task<ServiceResult> GeneratePasswordResetTokenAsync(ForgetPasswordRequest request)
    {

        var user = await userManager.FindByEmailAsync(request.email);

        if (user == null)
        {
            return ServiceResult.Fail("User not found");
        }

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var resetLink = $"http://localhost:4200/password-res?email={request.email}&token={Uri.EscapeDataString(token)}";
        await mailService.SendPasswordResetEmailAsync(request.email, resetLink);

        return ServiceResult.Success();
    }
    
    public async Task<ServiceResult> VerifyPasswordResetTokenAsync(VerifyUserToken request)
    {

        var user = await userManager.FindByEmailAsync(request.email);

        if (user == null)
        {
            return ServiceResult.Fail("User not found");
        }

        var checkToken = await userManager.VerifyUserTokenAsync(user, userManager.Options.Tokens.PasswordResetTokenProvider, "ResetPassword", request.token);

        if (!checkToken) return ServiceResult.Fail("Token is expired");

        return ServiceResult.Success();
    }
}