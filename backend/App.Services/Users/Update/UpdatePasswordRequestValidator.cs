using FluentValidation;

namespace App.Services.Users.Update;

public class UpdatePasswordRequestValidator : AbstractValidator<UpdatePasswordRequest>
{
    public UpdatePasswordRequestValidator()
    {
        RuleFor(x => x.NewPassword)
            .NotEqual(x => x.OldPassword)
            .WithMessage("New password cannot be the same as the old password.");

        RuleFor(x => x.ReNewPassword)
            .Equal(x => x.NewPassword)
            .WithMessage("Passwords do not match.");
    }
}