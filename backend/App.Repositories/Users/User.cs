using Microsoft.AspNetCore.Identity;

namespace App.Repositories.Users;

public class User : IdentityUser<string>
{
    public User()
    {
        Id = Guid.NewGuid().ToString();
    }

    //name and surname
}