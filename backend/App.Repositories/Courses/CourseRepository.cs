using Microsoft.EntityFrameworkCore;

namespace App.Repositories.Courses;

public class CourseRepository : GenericRepository<Course>, ICourseRepository
{
    public CourseRepository(AppDbContext context) : base(context)
    {
        
    }
    
    public Task<List<Course>> GetTopPriceCoursesAsync(int count)
    {
        return context.Courses.OrderByDescending(x => x.Price).Take(count).ToListAsync();
    }
}