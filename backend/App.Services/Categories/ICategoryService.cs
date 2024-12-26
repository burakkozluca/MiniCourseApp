using App.Services.Categories.Create;
using App.Services.Categories.Dto;
using App.Services.Categories.Update;

namespace App.Services.Categories;

public interface ICategoryService
{
    Task<ServiceResult<CategoryWithCoursesDto>> GetCategoryWithCoursesAsync(int categoryId);
    Task<ServiceResult<List<CategoryWithCoursesDto>>> GetCategoryWithCoursesAsync();
    Task<ServiceResult<CategoryDto?>> GetByIdAsync(int id);
    Task<ServiceResult<int>> CreateAsync(CreateCategoryRequest request);
    Task<ServiceResult> UpdateAsync(UpdateCategoryRequest request);
    Task<ServiceResult> DeleteAsync(int id);
    Task<ServiceResult<List<CategoryDto>>> GetAllListAsync();
}