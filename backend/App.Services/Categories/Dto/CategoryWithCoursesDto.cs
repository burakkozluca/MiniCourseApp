namespace App.Services.Categories.Dto;

public record CategoryWithCoursesDto(int id, string name, List<CourseDto> courses);