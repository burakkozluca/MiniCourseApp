namespace App.Repositories.Categories;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<Category?> GetCategoryWithCoursesAsync(int id);
    
    IQueryable<Category> GetCategoryWithCoursesAsync();
}