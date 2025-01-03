namespace App.Services.Courses;

public record CourseDto(int Id, string Name, int Stock, decimal Price, int CategoryId, string Description, string imageUrl);