using App.Services.Users.Create;
using App.Services.Users.Update;
using Microsoft.AspNetCore.Identity.Data;

namespace App.Services.Users;

public interface IUserService
{
    Task<ServiceResult> CreateUserAsync(CreateUserRequest request);
    
    Task<ServiceResult<UserDto>> GetUserByName(string userName);
    
    Task<ServiceResult> ChangePassword(UpdatePasswordRequest request , string userId);
    
    Task<ServiceResult<UserDto>> UpdateUserAsync(UpdateUserRequest request, string userId);
    
    Task<ServiceResult> ResetPassword(ResetPasswordRequest request);
}