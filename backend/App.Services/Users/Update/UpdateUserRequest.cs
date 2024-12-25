namespace App.Services.Users.Update;

public record UpdateUserRequest(string FirstName , string LastName , string Email , DateTime DateOfBirth , string PhoneNumber);