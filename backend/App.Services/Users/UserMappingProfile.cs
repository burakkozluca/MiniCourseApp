using App.Repositories.Users;
using App.Services.Users.Update;
using AutoMapper;

namespace App.Services.Users;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<User, UserDto>().ReverseMap();
        
        CreateMap<UpdateUserRequest, User>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}