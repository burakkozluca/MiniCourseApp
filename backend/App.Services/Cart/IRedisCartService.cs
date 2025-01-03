namespace App.Services.Cart
{
    public interface IRedisCartService
    {
        Task<bool> AddToCartAsync(string userId, int courseId);
        Task<bool> RemoveFromCartAsync(string userId, int courseId);
        Task<List<int>> GetCartItemsAsync(string userId);
        Task<bool> ClearCartAsync(string userId);
    }
} 