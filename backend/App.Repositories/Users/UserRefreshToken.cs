namespace App.Repositories.Users;

public class UserRefreshToken
{
    public string UserId { get; set; } = default!;
    public string? Code { get; set; }
    public DateTime Expiration { get; set; } = default!;
}