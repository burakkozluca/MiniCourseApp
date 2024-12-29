using App.Services.Courses.Create;
using App.Services.Courses.Update;
using App.Services.Courses.UpdateStock;

namespace App.Services.Courses;

public interface ICourseService
{
    Task<ServiceResult<List<CourseDto>>> GetTopPricesAsync(int count);
    Task<ServiceResult<CourseDto?>> GetByIdAsync(int id);
    Task<ServiceResult<CreateCourseResponse>> CreateAsync(CreateCourseRequest request);
    Task<ServiceResult> UpdateAsync(UpdateCourseRequest request);
    Task<ServiceResult> UpdateStockAsync(UpdateCourseStockRequest request);
    Task<ServiceResult> DeleteAsync(int id);
    Task<ServiceResult<List<CourseDto>>> GetAllListAsync();
    Task<ServiceResult<List<CourseDto>>> GetPagedAllListAsync(int pageNumber, int pageSize);
}