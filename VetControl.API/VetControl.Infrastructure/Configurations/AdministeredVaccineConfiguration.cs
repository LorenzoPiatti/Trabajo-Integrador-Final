using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VetControl.Domain.Entities;

namespace VetControl.Infrastructure.Configurations;

public class AdministeredVaccineConfiguration : IEntityTypeConfiguration<AdministeredVaccine>
{
    public void Configure(EntityTypeBuilder<AdministeredVaccine> builder)
    {
        builder.ToTable("AdministeredVaccines");

        builder.HasKey(av => av.AdministeredVaccineId);

        builder.Property(av => av.ApplicationDate)
            .IsRequired();

        builder.Property(av => av.NextDueDate)
            .IsRequired();

        builder.Property(av => av.Observations);

        builder.HasOne(av => av.Vaccine)
            .WithMany(v => v.AdministeredVaccines)
            .HasForeignKey(av => av.VaccineId);

        builder.HasOne(av => av.Pet)
            .WithMany(p => p.AdministeredVaccines)
            .HasForeignKey(av => av.PetId);

        builder.HasOne(av => av.Veterinarian)
            .WithMany(u => u.AdministeredVaccines)
            .HasForeignKey(av => av.VeterinarianId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}