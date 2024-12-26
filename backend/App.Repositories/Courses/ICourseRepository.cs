namespace App.Repositories.Courses;

public interface ICourseRepository : IGenericRepository<Course>
{
    Task<List<Course>> GetTopPriceCoursesAsync(int count);
}