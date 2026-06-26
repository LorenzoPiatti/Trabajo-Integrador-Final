using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VetControl.Domain.Entities;

namespace VetControl.Infrastructure.Configurations;

public class PetConfiguration : IEntityTypeConfiguration<Pet>
{
    public void Configure(EntityTypeBuilder<Pet> builder)
    {
        builder.ToTable("Pets");

        builder.HasKey(p => p.PetId);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Species)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Breed)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.BirthDate)
            .IsRequired();

        builder.Property(p => p.Observations);

        builder.HasOne(p => p.Owner)
            .WithMany(o => o.Pets)
            .HasForeignKey(p => p.OwnerId);
    }
}