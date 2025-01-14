using App.Repositories.Courses;

namespace App.Repositories.Categories;

public class Category : IAuditEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;

    public List<Course>? Courses { get; set; }
    
    public DateTime Created { get; set;}
    public DateTime? Updated { get; set; }
}