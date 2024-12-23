using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace App.Repositories
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer("Server=localhost,1433;Database=MiniCoursesApp;User Id=sa;Password=BEB-Lti123.;TrustServerCertificate=True;Encrypt=False");
            
            return new AppDbContext(optionsBuilder.Options);
        }
    }
}