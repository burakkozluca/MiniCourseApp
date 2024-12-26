using Microsoft.EntityFrameworkCore;

namespace App.Repositories.Categories;

public class CategoryRepository(AppDbContext context) : GenericRepository<Category>(context), ICategoryRepository
{
    public IQueryable<Category> GetCategoryWithCoursesAsync()
    {
        return context.Categories.Include(c => c.Courses).AsQueryable();
    }

    public async Task<Category?> GetCategoryWithCoursesAsync(int id)
    {            
        return await context.Categories.Include(c => c.Courses).FirstOrDefaultAsync();       
    }
}
