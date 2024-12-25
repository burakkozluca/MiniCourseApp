namespace App.Services.Users.Update;

public record UpdatePasswordRequest(string OldPassword, string NewPassword, string ReNewPassword);