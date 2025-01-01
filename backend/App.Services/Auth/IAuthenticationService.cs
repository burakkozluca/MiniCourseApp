namespace App.Services.Auth;

public interface IAuthenticationService
{
    Task<ServiceResult<TokenDto>> CreateTokenAsync(LoginDto loginDto);
    Task<ServiceResult<TokenDto>> CreateTokenByRefreshTokenAsync(string refreshToken);
    Task<ServiceResult> RevokeRefreshToken(string refreshToken);
    Task<ServiceResult> GeneratePasswordResetTokenAsync(ForgetPasswordRequest request);
    Task<ServiceResult> VerifyPasswordResetTokenAsync(VerifyUserToken request);
}