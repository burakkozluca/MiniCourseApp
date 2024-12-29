using App.Repositories.Courses;
using App.Services.Courses;
using App.Services.Courses.Create;
using App.Services.Courses.Update;
using AutoMapper;

namespace App.Services;

internal class CourseMappingProfile : Profile
{
    public CourseMappingProfile()
    {
        CreateMap<Course, CourseDto>().ReverseMap();
        CreateMap<CreateCourseRequest, Course>().ForMember(dest => dest.Name, 
            opt => opt.MapFrom(src => src.Name.ToLowerInvariant()));
        CreateMap<UpdateCourseRequest, Course>().ForMember(dest => dest.Name,
            opt => opt.MapFrom(src => src.Name.ToLowerInvariant()));
    }
}