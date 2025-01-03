using Microsoft.AspNetCore.Http;

namespace App.Services.Helpers;

public interface IFileService
{
    Task<string> SaveFileAsync(IFormFile imageFile);
    void DeleteFile(string fileNameWithExtension);
}