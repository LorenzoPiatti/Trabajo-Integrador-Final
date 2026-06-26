using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VetControl.Domain.Entities;

namespace VetControl.Infrastructure.Configurations;

public class MedicalRecordConfiguration : IEntityTypeConfiguration<MedicalRecord>
{
    public void Configure(EntityTypeBuilder<MedicalRecord> builder)
    {
        builder.ToTable("MedicalRecords");

        builder.HasKey(m => m.MedicalRecordId);

        builder.Property(m => m.Date)
            .IsRequired();

        builder.Property(m => m.Description)
            .IsRequired();

        builder.Property(m => m.Diagnosis);

        builder.Property(m => m.Treatment)
            .IsRequired();

        builder.HasOne(m => m.Pet)
            .WithMany(p => p.MedicalRecords)
            .HasForeignKey(m => m.PetId);

        builder.HasOne(m => m.Veterinarian)
            .WithMany(u => u.MedicalRecords)
            .HasForeignKey(m => m.VeterinarianId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}