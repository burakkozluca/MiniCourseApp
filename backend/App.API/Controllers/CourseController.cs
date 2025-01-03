using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using App.Services.Courses;
using App.Services.UserCourses;

namespace App.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IUserCourseService _userCourseService;

        public CourseController(ICourseService courseService, IUserCourseService userCourseService)
        {
            _courseService = courseService;
            _userCourseService = userCourseService;
        }

        [Authorize]
        [HttpPost("purchase/{courseId}")]
        public async Task<IActionResult> PurchaseCourse(int courseId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                // Önce kursun var olduğunu kontrol edelim
                var courseResult = await _courseService.GetByIdAsync(courseId);
                if (!courseResult.IsSuccess || courseResult.Data == null)
                {
                    return BadRequest(new { isSuccess = false, message = "Course not found" });
                }

                // Kullanıcı kursu zaten satın almış mı kontrol edelim
                var hasPurchased = await _userCourseService.HasUserPurchasedCourseAsync(userId, courseId);
                if (hasPurchased)
                {
                    return BadRequest(new { isSuccess = false, message = "You have already purchased this course" });
                }

                // Kursu kullanıcıya ekleyelim
                var result = await _userCourseService.AddUserCourseAsync(userId, courseId);
                if (!result)
                {
                    return BadRequest(new { isSuccess = false, message = "Failed to purchase course" });
                }

                return Ok(new { isSuccess = true, message = "Course purchased successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { isSuccess = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("my-courses")]
        public async Task<IActionResult> GetMyCourses()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var courses = await _userCourseService.GetUserCoursesAsync(userId);
                return Ok(new { isSuccess = true, data = courses });
            }
            catch (Exception ex)
            {
                return BadRequest(new { isSuccess = false, message = ex.Message });
            }
        }
    }
} 