using App.Services.Courses;

namespace App.Services.UserCourses
{
    public interface IUserCourseService
    {
        Task<bool> AddUserCourseAsync(string userId, int courseId);
        Task<List<CourseDto>> GetUserCoursesAsync(string userId);
        Task<bool> HasUserPurchasedCourseAsync(string userId, int courseId);
    }
} 