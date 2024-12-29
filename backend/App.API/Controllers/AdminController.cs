using App.Services.Admin;
using Microsoft.AspNetCore.Mvc;

namespace App.API.Controllers;

public class AdminController(IAdminService adminService) : CustomController
{
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {

        var response = await adminService.GetUsers();
        return CreateActionResult(response);
    }

    [HttpPut("users/{id:guid}")]
    public async Task<IActionResult> UpdateUser([FromForm] UpdateAdminUserRequest request, string id)
    {
        var response = await adminService.UpdateUserAsync(request, id);
        return CreateActionResult(response);
    }
}