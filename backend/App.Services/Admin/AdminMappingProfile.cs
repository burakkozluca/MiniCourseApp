using App.Repositories.Users;
using AutoMapper;

namespace App.Services.Admin;

public class AdminMappingProfile : Profile
{
    public AdminMappingProfile()
    {
        CreateMap<User, AdminUserDto>()
            .ForCtorParam("Id", opt => opt.MapFrom(src => src.Id))
            .ForCtorParam("FirstName", opt => opt.MapFrom(src => src.FirstName))
            .ForCtorParam("LastName", opt => opt.MapFrom(src => src.LastName))
            .ForCtorParam("Email", opt => opt.MapFrom(src => src.Email))
            .ForCtorParam("DateOfBirth", opt => opt.MapFrom(src => src.DateOfBirth ?? DateTime.MinValue))
            .ForCtorParam("PhoneNumber", opt => opt.MapFrom(src => src.PhoneNumber));
        
        CreateMap<UpdateAdminUserRequest, User>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}