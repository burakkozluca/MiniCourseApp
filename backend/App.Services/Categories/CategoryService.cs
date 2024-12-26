using System.Net;
using App.Repositories;
using App.Repositories.Categories;
using App.Services.Categories.Create;
using App.Services.Categories.Dto;
using App.Services.Categories.Update;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace App.Services.Categories;

public class CategoryService
    (
        ICategoryRepository categoryRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper
            ) : ICategoryService
{
    public async Task<ServiceResult<int>> CreateAsync(CreateCategoryRequest request)
        {
            var anyCategory = await categoryRepository.Where(x=> x.Name == request.name).AnyAsync();
            if(anyCategory)
            {
                return ServiceResult<int>.Fail("kategori ismi veritabanında bulunmaktadır.",
                    HttpStatusCode.BadRequest);
            }

            var category = mapper.Map<Category>(request);
            await categoryRepository.AddAsync(category);
            await unitOfWork.SaveChangesAsync();
            return ServiceResult<int>.SuccessCreated(category.Id, $"api/categories/{category.Id}");

        }

        public async Task<ServiceResult> DeleteAsync(int id)
        {
            var category = await categoryRepository.GetByIdAsync( id );
            if (category == null)
            {
                return ServiceResult.Fail("kategori bulunamadı", System.Net.HttpStatusCode.NotFound);
            }

            categoryRepository.Delete(category);
            await unitOfWork.SaveChangesAsync();

            return ServiceResult.Success(HttpStatusCode.NoContent);
        }

        public async Task<ServiceResult<List<CategoryDto>>> GetAllListAsync()
        {
            var categories = await categoryRepository.GetAll().ToListAsync();

            var categoriesDto = mapper.Map<List<CategoryDto>>(categories);

            return ServiceResult<List<CategoryDto>>.Success(categoriesDto);

        }

        public async Task<ServiceResult<CategoryDto?>> GetByIdAsync(int id)
        {
            var category = await categoryRepository.GetByIdAsync(id);
            if(category == null)
            {
                return ServiceResult<CategoryDto?>.Fail("kategori bulunamadı", System.Net.HttpStatusCode.NotFound);
            }

            var categoryDto = mapper.Map<CategoryDto>(category);
            return ServiceResult<CategoryDto?>.Success(categoryDto);

        }

        public async Task<ServiceResult<CategoryWithCoursesDto>> GetCategoryWithCoursesAsync(int categoryId)
        {
            var category = await categoryRepository.GetCategoryWithCoursesAsync(categoryId);
            if (category == null)
            {
                return ServiceResult<CategoryWithCoursesDto>.Fail("kategori bulunamadı" , HttpStatusCode.NotFound);
            }
            var categoryDto = mapper.Map<CategoryWithCoursesDto>(category);
            return ServiceResult<CategoryWithCoursesDto>.Success(categoryDto);

        }

        public async Task<ServiceResult<List<CategoryWithCoursesDto>>> GetCategoryWithCoursesAsync()
        {
            var category = await categoryRepository.GetCategoryWithCoursesAsync().ToListAsync();

            if (category == null)
            {
                return ServiceResult<List<CategoryWithCoursesDto>>.Fail("kategoriler bulunamadı", HttpStatusCode.NotFound);
            }
            var categoryDto = mapper.Map<List<CategoryWithCoursesDto>>(category);
            return ServiceResult<List<CategoryWithCoursesDto>>.Success(categoryDto);
        }

        public async Task<ServiceResult> UpdateAsync(UpdateCategoryRequest request)
        {
            var category = await categoryRepository.GetByIdAsync(request.id);

            if (category is null)
            {
                return ServiceResult.Fail("category not found", HttpStatusCode.NotFound);
            }


            var isCategoryNameExist = await categoryRepository.Where(x => x.Name == request.name && x.Id != category.Id).AnyAsync();

            if (isCategoryNameExist)
            {
                return ServiceResult.Fail("kategori ismi veritabanında bulunmaktadır.",
                    HttpStatusCode.BadRequest);
            }


            

            category = mapper.Map(request,category);

            categoryRepository.Update(category);

            await unitOfWork.SaveChangesAsync();

            return ServiceResult.Success(HttpStatusCode.NoContent);
        }
}