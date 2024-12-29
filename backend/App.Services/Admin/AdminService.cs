using App.Repositories.Users;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace App.Services.Admin;

public class AdminService
    (
        IMapper mapper,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager
        ) : IAdminService
    {
    public async Task<ServiceResult<AdminUserDto>> UpdateUserAsync(UpdateAdminUserRequest request, string userId)
        {

            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return ServiceResult<AdminUserDto>.Fail("User not found", System.Net.HttpStatusCode.NotFound);
            }

            var currentRoles = await userManager.GetRolesAsync(user);

            var updatedUser = mapper.Map(request, user);
            var updateResult = await userManager.UpdateAsync(updatedUser);

            if (!updateResult.Succeeded)
            {
                var errors = updateResult.Errors.Select(x => x.Description).ToList();
                return ServiceResult<AdminUserDto>.Fail(errors);
            }

            if (!string.IsNullOrEmpty(request.role))
            {

                if (!currentRoles.Contains(request.role))
                {

                    var removeRolesResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
                    if (!removeRolesResult.Succeeded)
                    {
                        var errors = removeRolesResult.Errors.Select(x => x.Description).ToList();
                        return ServiceResult<AdminUserDto>.Fail(errors);
                    }

                    var addRoleResult = await userManager.AddToRoleAsync(user, request.role);
                    if (!addRoleResult.Succeeded)
                    {
                        var errors = addRoleResult.Errors.Select(x => x.Description).ToList();
                        return ServiceResult<AdminUserDto>.Fail(errors);
                    }
                }
            }



            var adminUserDto = mapper.Map<AdminUserDto>(updatedUser);
            return ServiceResult<AdminUserDto>.Success(adminUserDto);
        }



        public async Task<ServiceResult<List<AdminUserDto>>> GetUsers()
        {

            var users = await userManager.Users.ToListAsync();

            var adminUserDto = mapper.Map<List<AdminUserDto>>(users);

            return ServiceResult<List<AdminUserDto>>.Success(adminUserDto);
        }
}