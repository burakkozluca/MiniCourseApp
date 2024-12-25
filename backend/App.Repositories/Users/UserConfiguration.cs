using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace App.Repositories.Users;

public class UserConfiguration :IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        //builder.Property(x=> x.City).HasMaxLength(150);
        //builder.Property(x => x.Name).HasMaxLength(50);
        //builder.Property(x => x.Surname).HasMaxLength(100);
        //builder.Property(x => x.DateOfBirth).HasColumnType("date");
    }
}