namespace App.Repositories
{
    public interface IUserCourseRepository
    {
        Task<bool> AddAsync(string userId, int courseId);
        Task<List<int>> GetUserCourseIdsAsync(string userId);
        Task<bool> HasPurchasedAsync(string userId, int courseId);
    }
} 