using App.Services;
using App.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace App.API.Controllers;

[Route("/api/[controller]/[action]")]
public class AuthController(IAuthenticationService authenticationService) : CustomController
{

    [HttpPost]
    public async Task<IActionResult> CreateToken(LoginDto loginDto)
    {

        var response = await authenticationService.CreateTokenAsync(loginDto);
        return CreateActionResult(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTokenByRefreshToken(RefreshTokenDto refreshToken)
    {
        var response = await authenticationService.CreateTokenByRefreshTokenAsync(refreshToken.token);
        return CreateActionResult(response);
    }

    [HttpPost]
    public async Task<IActionResult> RevokeRefreshToken(RefreshTokenDto refreshTokenDto)
    {
        ServiceResult result = await authenticationService.RevokeRefreshToken(refreshTokenDto.token);

        return CreateActionResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> ForgotPassword(ForgetPasswordRequest request)
    {
        ServiceResult result = await authenticationService.GeneratePasswordResetTokenAsync(request);

        return CreateActionResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> VerifyUserToken([FromBody] VerifyUserToken request)
    {
        ServiceResult result = await authenticationService.VerifyPasswordResetTokenAsync(request);

        return CreateActionResult(result);
    }
}