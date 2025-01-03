using App.Repositories.Users;
using Microsoft.EntityFrameworkCore;

namespace App.Repositories;

    public class UserCourseRepository : IUserCourseRepository
    {
        private readonly AppDbContext _context;

        public UserCourseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddAsync(string userId, int courseId)
        {
            try
            {
                var userCourse = new UserCourse
                {
                    UserId = userId,
                    CourseId = courseId,
                    PurchaseDate = DateTime.UtcNow
                };

                await _context.UserCourses.AddAsync(userCourse);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<int>> GetUserCourseIdsAsync(string userId)
        {
            return await _context.UserCourses
                .Where(uc => uc.UserId == userId)
                .Select(uc => uc.CourseId)
                .ToListAsync();
        }

        public async Task<bool> HasPurchasedAsync(string userId, int courseId)
        {
            return await _context.UserCourses
                .AnyAsync(uc => uc.UserId == userId && uc.CourseId == courseId);
        }
    }
