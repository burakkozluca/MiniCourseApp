using FluentValidation;

namespace App.Services.Auth;

public class ForgetPasswordRequestValidator : AbstractValidator<ForgetPasswordRequest>
{
    public ForgetPasswordRequestValidator()
    {
        RuleFor(x => x.email).NotEmpty().EmailAddress();
    }
}