using System.Security.Claims;
using App.Services.Users;
using App.Services.Users.Create;
using App.Services.Users.Update;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.API.Controllers;

public class UserController(IUserService userService) : CustomController
{
    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserRequest userDto)
    {
        var result = await userService.CreateUserAsync(userDto);
        return CreateActionResult(result);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetUser()
    {
        var result = await userService.GetUserByName(HttpContext.User.Identity.Name);
        return CreateActionResult(result);
    }
    
    [HttpPost("ChangePassword")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(UpdatePasswordRequest request, string userId)
    {
        var result = await userService.ChangePassword(request, userId);
        return CreateActionResult(result);
    }
    
    [HttpPost("UpdateProfile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile(UpdateUserRequest request)
    {
        string userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
        
        var result = await userService.UpdateUserAsync(request, userId);
        return CreateActionResult(result);
    }
}