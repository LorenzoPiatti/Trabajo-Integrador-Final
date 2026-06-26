using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VetControl.Domain.Entities;

namespace VetControl.Infrastructure.Configurations;

public class OwnerConfiguration : IEntityTypeConfiguration<Owner>
{
    public void Configure(EntityTypeBuilder<Owner> builder)
    {
        builder.ToTable("Owners");

        builder.HasKey(o => o.OwnerId);

        builder.Property(o => o.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(o => o.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(o => o.Phone)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(o => o.Address)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasOne(o => o.User)
            .WithOne(u => u.Owner)
            .HasForeignKey<Owner>(o => o.UserId);
    }
}