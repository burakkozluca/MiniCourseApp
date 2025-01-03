using App.Repositories;
using App.Services.Courses;

namespace App.Services.UserCourses
{
    public class UserCourseService : IUserCourseService
    {
        private readonly IUserCourseRepository _userCourseRepository;
        private readonly ICourseService _courseService;

        public UserCourseService(IUserCourseRepository userCourseRepository, ICourseService courseService)
        {
            _userCourseRepository = userCourseRepository;
            _courseService = courseService;
        }

        public async Task<bool> AddUserCourseAsync(string userId, int courseId)
        {
            return await _userCourseRepository.AddAsync(userId, courseId);
        }

        public async Task<List<CourseDto>> GetUserCoursesAsync(string userId)
        {
            var courseIds = await _userCourseRepository.GetUserCourseIdsAsync(userId);
            var courses = new List<CourseDto>();

            foreach (var courseId in courseIds)
            {
                var courseResult = await _courseService.GetByIdAsync(courseId);
                if (courseResult.IsSuccess && courseResult.Data != null)
                {
                    courses.Add(courseResult.Data);
                }
            }

            return courses;
        }

        public async Task<bool> HasUserPurchasedCourseAsync(string userId, int courseId)
        {
            return await _userCourseRepository.HasPurchasedAsync(userId, courseId);
        }
    }
} 