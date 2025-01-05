using App.Services.Courses;
using App.Services.Courses.Create;
using App.Services.Courses.Update;
using App.Services.Courses.UpdateStock;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.API.Controllers;

[Authorize]
public class CoursesController(ICourseService courseService) : CustomController
{
    [HttpGet, AllowAnonymous]
    public async Task<IActionResult> GetAll() => CreateActionResult(await courseService.GetAllListAsync());
    
    [HttpGet("{id:int}"), AllowAnonymous]
    public async Task<IActionResult> GetById(int id) => CreateActionResult(await courseService.GetByIdAsync(id));
    
    [HttpGet("{pageNumber:int}/{pageSize:int}"), AllowAnonymous]
    public async Task<IActionResult> GetPagedAll(int pageNumber, int pageSize) => CreateActionResult(await courseService.GetPagedAllListAsync(pageNumber,pageSize));
    
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateCourseRequest request) => CreateActionResult(await courseService.CreateAsync(request));
    
    [HttpPut]
    public async Task<IActionResult> Update([FromForm] UpdateCourseRequest request) => CreateActionResult(await courseService.UpdateAsync(request));
    
    [HttpPatch("stock")]
    public async Task<IActionResult> UpdateStock(UpdateCourseStockRequest request) => CreateActionResult(await courseService.UpdateStockAsync(request));
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id) => CreateActionResult(await courseService.DeleteAsync(id));
}