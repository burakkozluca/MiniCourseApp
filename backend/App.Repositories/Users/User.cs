using Microsoft.AspNetCore.Identity;

namespace App.Repositories.Users;

public class User : IdentityUser<string>
{
    public string? Name { get; set; } 
}