using App.Services.Categories;
using App.Services.Categories.Create;
using App.Services.Categories.Update;
using Microsoft.AspNetCore.Mvc;

namespace App.API.Controllers;

public class CategoryController(ICategoryService categoryService) : CustomController
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => CreateActionResult(await categoryService.GetAllListAsync());
    
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id) => CreateActionResult(await categoryService.GetByIdAsync(id)); 
    
    [HttpGet("{id:int}/courses")]
    public async Task<IActionResult> GetCategoriesWithCourse(int id) => CreateActionResult(await categoryService.GetCategoryWithCoursesAsync(id));
    
    [HttpGet("courses")]
    public async Task<IActionResult> GetCategoriesWithCourse() => CreateActionResult(await categoryService.GetCategoryWithCoursesAsync());
    
    [HttpPost]
    public async Task<IActionResult> Create(CreateCategoryRequest request) => CreateActionResult(await categoryService.CreateAsync(request));
    
    [HttpPut]
    public async Task<IActionResult> Update(UpdateCategoryRequest request) => CreateActionResult(await categoryService.UpdateAsync(request));
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id) => CreateActionResult(await categoryService.DeleteAsync(id));
}