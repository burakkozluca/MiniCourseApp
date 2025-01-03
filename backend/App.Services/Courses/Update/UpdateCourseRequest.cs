using Microsoft.AspNetCore.Http;

namespace App.Services.Courses.Update;

public record UpdateCourseRequest(int Id, string Name,int Stock,decimal Price, int CategoryId, string Description, IFormFile imageFile);