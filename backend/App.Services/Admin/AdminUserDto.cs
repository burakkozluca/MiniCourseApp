namespace App.Services.Admin;

public record AdminUserDto(string Id, string FirstName, string LastName, string Email, DateTime DateOfBirth, string PhoneNumber);
