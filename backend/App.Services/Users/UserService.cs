using App.Repositories.Users;
using App.Services.Users.Create;
using App.Services.Users.Update;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace App.Services.Users;

public class UserService
    (
        IMapper mapper,
        UserManager<User> userManager
        ) : IUserService
{
    public async Task<ServiceResult> CreateUserAsync(CreateUserRequest request)
    {
        var user = new User
        {
            Email = request.Email,
            UserName = request.Username
        };

        var result = await userManager.CreateAsync(user, request.password);
        if(!result.Succeeded)
        {
            var errors = result.Errors.Select(x => x.Description).ToList();
            return ServiceResult.Fail(errors);
        }
        
        return ServiceResult.Success();
    }
    
    public async Task<ServiceResult<UserDto>> UpdateUserAsync(UpdateUserRequest request, string userId)
    {
        var user = await userManager.FindByIdAsync(userId);
        
        if(user == null)
        {
            return ServiceResult<UserDto>.Fail("User not found");
        }
        
        var updatedUser = mapper.Map(request, user);
        
        var result = await userManager.UpdateAsync(updatedUser);
        
        if(!result.Succeeded)
        {
            var errors = result.Errors.Select(x => x.Description).ToList();
            return ServiceResult<UserDto>.Fail(errors);
        }
        
        return ServiceResult<UserDto>.Success(mapper.Map<UserDto>(updatedUser));
    }
    
    public async Task<ServiceResult<UserDto>> GetUserByName(string userName)
    {
        var user = await userManager.FindByNameAsync(userName);
        
        if(user == null)
        {
            return ServiceResult<UserDto>.Fail("User not found");
        }
        
        return ServiceResult<UserDto>.Success(mapper.Map<UserDto>(user));
    }
}