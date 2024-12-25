namespace App.Services.Users;

public record UserDto(string Id, string Email, string FirstName, string LastName, DateTime DateOfBirth, string PhoneNumber);
