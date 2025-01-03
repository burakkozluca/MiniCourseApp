using Microsoft.AspNetCore.Http;

namespace App.Services.Courses.Create;

public record CreateCourseRequest(int Stock, string Name, decimal Price, int CategoryId, string Description, IFormFile imageFile);