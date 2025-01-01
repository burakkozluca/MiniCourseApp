using App.Repositories.Users;

namespace App.Services.Auth;

public interface ITokenService
{
    Task<TokenDto> CreateTokenAsync(User user);


}