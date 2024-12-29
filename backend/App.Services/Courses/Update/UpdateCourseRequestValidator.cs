using FluentValidation;

namespace App.Services.Courses.Update;

public class UpdateCourseRequestValidator : AbstractValidator<UpdateCourseRequest>
{
    public UpdateCourseRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name field is required")
            .Length(3, 150).WithMessage("Name field has to be between 3-150 character");
        
        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price has to be greater than 0");
        
        RuleFor(x => x.Stock)
            .InclusiveBetween(1, 100).WithMessage("stock has to be between 1 - 100");
        
        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("CategoryId has to be greater than 0");
    }
}