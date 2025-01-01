namespace App.Services.Auth;

public class TokenDto
{
    public string AccessToken { get; set; } = default!;
    public DateTime AccessTokenExpiration { get; set; } = default!;
    public string RefreshToken { get; set; } = default!;
    public DateTime RefreshTokenExpiration { get; set; } = default!;
}