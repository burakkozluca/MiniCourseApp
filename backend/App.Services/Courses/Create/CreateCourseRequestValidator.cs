using App.Repositories.Courses;
using FluentValidation;

namespace App.Services.Courses.Create;

public class CreateCourseRequestValidator : AbstractValidator<CreateCourseRequest>
{
    private readonly ICourseRepository _courseRepository;
    
    public CreateCourseRequestValidator(ICourseRepository courseRepository)
    {
        _courseRepository = courseRepository;

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .Length(3,150).WithMessage("Name must be between 3 and 150 characters");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");


        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("CategoryId has to be greater than 0");
        RuleFor(x => x.Stock)
            .InclusiveBetween(1,100).WithMessage("Stock must be between 1 and 100");
    }
}