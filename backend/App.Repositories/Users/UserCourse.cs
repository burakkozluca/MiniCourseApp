using App.Repositories.Courses;

namespace App.Repositories.Users;
public class UserCourse    
{        public int Id { get; set; }
        public string UserId { get; set; }        
        public int CourseId { get; set; }        
        public DateTime PurchaseDate { get; set; }        
        // Navigation properties        
        public User User { get; set; }        
        public Course Course { get; set; }    
}
 