using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace App.Services.Helpers;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment environment;
        private readonly string contentPath;
        private readonly string filePath;


        public FileService(IWebHostEnvironment environment)
        {
            this.environment = environment;
            contentPath = environment.ContentRootPath;
            filePath = Path.Combine(contentPath, "Uploads");


            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

        }

     

        public async Task<string> SaveFileAsync(IFormFile imageFile)
        {
           
            string[] allowedFileExtensions = { ".jpg", ".jpeg", ".png" };
            var ext = Path.GetExtension(imageFile.FileName).ToLower();

          
            if (!allowedFileExtensions.Contains(ext))
            {
                throw new ArgumentException($"Yalnızca {string.Join(", ", allowedFileExtensions)} uzantıları kabul edilmektedir.");
            }

            var fileName = $"{Guid.NewGuid()}{ext}";
            var fileNameWithPath = Path.Combine(filePath, fileName);

            try
            {
                
                using (var stream = new FileStream(fileNameWithPath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }
            }
            catch (Exception ex)
            {
                throw new IOException($"Dosya kaydetme sırasında bir hata oluştu: {ex.Message}", ex);
            }
 
            return fileName;
        }


        public void DeleteFile(string fileNameWithExtension)
        {
            if (string.IsNullOrEmpty(fileNameWithExtension))
            {
                throw new ArgumentNullException("Dosya adı boş olamaz.");
            }

            var imageFilePath = Path.Combine(filePath, fileNameWithExtension);

            if (!File.Exists(imageFilePath))
            {
                throw new FileNotFoundException($"Belirtilen dosya bulunamadı: {fileNameWithExtension}");
            }

            File.Delete(filePath); //asnekron olabilir 
        }
}