using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VetControl.Domain.Entities;

namespace VetControl.Infrastructure.Configurations;

public class VaccineConfiguration : IEntityTypeConfiguration<Vaccine>
{
    public void Configure(EntityTypeBuilder<Vaccine> builder)
    {
        builder.ToTable("Vaccines");

        builder.HasKey(v => v.VaccineId);

        builder.Property(v => v.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(v => v.Description);

        builder.Property(v => v.FrequencyMonths)
            .IsRequired();

        builder.Property(v => v.Stock)
            .HasDefaultValue(0);
    }
}