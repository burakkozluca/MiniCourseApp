using System.Net;
using App.Repositories;
using App.Repositories.Courses;
using App.Services.Courses.Create;
using App.Services.Courses.Update;
using App.Services.Courses.UpdateStock;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace App.Services.Courses;

public class CourseService
    (
        ICourseRepository courseRepository,
        IUnitOfWork unitOfWork,
        IValidator<CreateCourseRequest> createCourseRequestValidator,
        IMapper mapper
        ) : ICourseService
{
    
    public async Task<ServiceResult<CreateCourseResponse>> CreateAsync(CreateCourseRequest request)
    {
        var anyCourse = await courseRepository.Where(x => x.Name == request.Name).AnyAsync();

        if (anyCourse)
        {
            return ServiceResult<CreateCourseResponse>.Fail("course name already exists in the database.",
                HttpStatusCode.BadRequest);
        }

        var course = mapper.Map<Course>(request);

        await courseRepository.AddAsync(course);
        await unitOfWork.SaveChangesAsync();

        return ServiceResult<CreateCourseResponse>.SuccessCreated(new CreateCourseResponse(course.Id),
            $"api/courses/{course.Id}");
    }
    
    public async Task<ServiceResult> DeleteAsync(int id)
    {
        var course = await courseRepository.GetByIdAsync(id);

        if (course == null)
        {
            return ServiceResult.Fail("Course not found", HttpStatusCode.NotFound);
        }

        courseRepository.Delete(course);
        await unitOfWork.SaveChangesAsync();

        return ServiceResult.Success(HttpStatusCode.NoContent);
    }
    
    public async Task<ServiceResult<List<CourseDto>>> GetAllListAsync()
    {
        var courses = await courseRepository.GetAll().ToListAsync();

        var coursesDto = mapper.Map<List<CourseDto>>(courses);

        return ServiceResult<List<CourseDto>>.Success(coursesDto);
    }
    
    public async Task<ServiceResult<CourseDto?>> GetByIdAsync(int id)
    {
        var course = await courseRepository.GetByIdAsync(id);

        if (course == null)
        {
            return ServiceResult<CourseDto?>.Fail("Course not found", HttpStatusCode.NotFound);
        }

        var courseDto = mapper.Map<CourseDto>(course);

        return ServiceResult<CourseDto?>.Success(courseDto);
    }
    
    public async Task<ServiceResult<List<CourseDto>>> GetPagedAllListAsync(int pageNumber, int pageSize)
    {
        var courses = await courseRepository.GetAll()
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var coursesDto = mapper.Map<List<CourseDto>>(courses);

        return ServiceResult<List<CourseDto>>.Success(coursesDto);
    }
    
    public async Task<ServiceResult<List<CourseDto>>> GetTopPricesAsync(int count)
    {
        var courses = await courseRepository.GetAll()
            .OrderByDescending(x => x.Price)
            .Take(count)
            .ToListAsync();

        var coursesDto = mapper.Map<List<CourseDto>>(courses);

        return ServiceResult<List<CourseDto>>.Success(coursesDto);
    }
    
    public async Task<ServiceResult> UpdateAsync(UpdateCourseRequest request)
    {
        var course = await courseRepository.GetByIdAsync(request.Id);

        if (course == null)
        {
            return ServiceResult.Fail("Course not found", HttpStatusCode.NotFound);
        }

        mapper.Map(request, course);

        courseRepository.Update(course);
        await unitOfWork.SaveChangesAsync();

        return ServiceResult.Success(HttpStatusCode.NoContent);
    }
    
    public async Task<ServiceResult> UpdateStockAsync(UpdateCourseStockRequest request)
    {
        var course = await courseRepository.GetByIdAsync(request.CourseId);

        if (course == null)
        {
            return ServiceResult.Fail("Course not found", HttpStatusCode.NotFound);
        }

        course.Stock += request.Stock;

        courseRepository.Update(course);
        await unitOfWork.SaveChangesAsync();

        return ServiceResult.Success(HttpStatusCode.NoContent);
    }
}