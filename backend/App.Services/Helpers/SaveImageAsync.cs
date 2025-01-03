using Microsoft.AspNetCore.Http;

namespace App.Services.Helpers;

// Resim Dosyasını Sunucuya Kaydetme Metodu
public static class ImageHelper
{
    public static async Task<string> SaveImageAsync(IFormFile imageFile)
    {
        var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "product-images");

        if (!Directory.Exists(uploadFolder))
        {
            Directory.CreateDirectory(uploadFolder);
        }

        var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
        var filePath = Path.Combine(uploadFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await imageFile.CopyToAsync(stream);
        }

        return $"/product-images/{uniqueFileName}";
    }
}