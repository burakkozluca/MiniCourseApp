namespace App.Services.Admin;

public interface IAdminService
{
    Task<ServiceResult<AdminUserDto>> UpdateUserAsync(UpdateAdminUserRequest request, string userId);
    Task<ServiceResult<List<AdminUserDto>>> GetUsers();
}