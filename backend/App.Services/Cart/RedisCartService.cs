using StackExchange.Redis;

namespace App.Services.Cart
{
    public class RedisCartService : IRedisCartService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IDatabase _db;

        public RedisCartService(IConnectionMultiplexer redis)
        {
            _redis = redis;
            _db = redis.GetDatabase();
        }

        public async Task<bool> AddToCartAsync(string userId, int courseId)
        {
            try
            {
                string key = $"cart:{userId}";
                Console.WriteLine($"Adding to Redis - Key: {key}, CourseId: {courseId}");
                
                var result = await _db.SetAddAsync(key, courseId);
                Console.WriteLine($"Redis Add Result: {result}");
                
                // Kontrol amaçlı mevcut elemanları listele
                var currentItems = await _db.SetMembersAsync(key);
                Console.WriteLine($"Current items in cart: {string.Join(", ", currentItems)}");
                
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Redis Add Error: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> RemoveFromCartAsync(string userId, int courseId)
        {
            string key = $"cart:{userId}";
            return await _db.SetRemoveAsync(key, courseId);
        }

        public async Task<List<int>> GetCartItemsAsync(string userId)
        {
            try
            {
                string key = $"cart:{userId}";
                Console.WriteLine($"Getting items from Redis - Key: {key}");
                
                var members = await _db.SetMembersAsync(key);
                Console.WriteLine($"Raw Redis members: {string.Join(", ", members)}");
                
                var result = members.Select(m => (int)m).ToList();
                Console.WriteLine($"Converted items: {string.Join(", ", result)}");
                
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Redis Get Error: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> ClearCartAsync(string userId)
        {
            string key = $"cart:{userId}";
            return await _db.KeyDeleteAsync(key);
        }
    }
} 