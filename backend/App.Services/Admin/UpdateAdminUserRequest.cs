namespace App.Services.Admin;

public record UpdateAdminUserRequest(string FirstName, string LastName, string Email, DateTime DateOfBirth, string PhoneNumber, string role);