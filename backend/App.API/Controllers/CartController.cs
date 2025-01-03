using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Services.Courses;
using App.Services.Cart;

namespace App.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly IRedisCartService _cartService;
        private readonly ICourseService _courseService;

        public CartController(IRedisCartService cartService, ICourseService courseService)
        {
            _cartService = cartService;
            _courseService = courseService;
        }

        [HttpPost("add/{courseId}")]
        public async Task<IActionResult> AddToCart(int courseId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                Console.WriteLine($"Adding to cart - UserId: {userId}, CourseId: {courseId}"); // Debug log

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                // Önce kursun var olduğunu kontrol edelim
                var courseResult = await _courseService.GetByIdAsync(courseId);
                if (!courseResult.IsSuccess || courseResult.Data == null)
                {
                    return BadRequest(new { isSuccess = false, message = "Course not found" });
                }

                var result = await _cartService.AddToCartAsync(userId, courseId);
                Console.WriteLine($"Add to cart result: {result}"); // Debug log

                return Ok(new { isSuccess = true, data = result });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddToCart: {ex.Message}"); // Debug log
                return BadRequest(new { isSuccess = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                Console.WriteLine($"GetCart - UserId: {userId}");

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var cartItems = await _cartService.GetCartItemsAsync(userId);
                Console.WriteLine($"Found {cartItems.Count} items in Redis: {string.Join(", ", cartItems)}");

                var courses = new List<CourseDto>();
                foreach (var courseId in cartItems)
                {
                    Console.WriteLine($"Fetching course ID: {courseId}");
                    var courseResult = await _courseService.GetByIdAsync(courseId);
                    
                    if (courseResult.IsSuccess && courseResult.Data != null)
                    {
                        Console.WriteLine($"Course found: {courseResult.Data.Name}");
                        courses.Add(courseResult.Data);
                    }
                    else
                    {
                        Console.WriteLine($"Course not found or error for ID: {courseId}");
                    }
                }

                Console.WriteLine($"Returning {courses.Count} courses to client");
                var response = new { isSuccess = true, data = courses };
                Console.WriteLine($"Response data: {System.Text.Json.JsonSerializer.Serialize(response)}");
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetCart Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return BadRequest(new { isSuccess = false, message = ex.Message });
            }
        }

        [HttpDelete("remove/{courseId}")]
        public async Task<IActionResult> RemoveFromCart(int courseId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _cartService.RemoveFromCartAsync(userId, courseId);
            return Ok(result);
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _cartService.ClearCartAsync(userId);
            return Ok(result);
        }
    }
} 