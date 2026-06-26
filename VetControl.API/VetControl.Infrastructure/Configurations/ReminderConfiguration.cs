using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VetControl.Domain.Entities;

namespace VetControl.Infrastructure.Configurations;

public class ReminderConfiguration : IEntityTypeConfiguration<Reminder>
{
    public void Configure(EntityTypeBuilder<Reminder> builder)
    {
        builder.ToTable("Reminders");

        builder.HasKey(r => r.ReminderId);

        builder.Property(r => r.ReminderDate)
            .IsRequired();

        builder.Property(r => r.Type)
            .IsRequired();

        builder.Property(r => r.Sent)
            .HasDefaultValue(false);

        builder.HasOne(r => r.Owner)
            .WithMany(o => o.Reminders)
            .HasForeignKey(r => r.OwnerId);

        builder.HasOne(r => r.Appointment)
            .WithMany(a => a.Reminders)
            .HasForeignKey(r => r.AppointmentId)
            .IsRequired(false);

        builder.HasOne(r => r.AdministeredVaccine)
            .WithMany(av => av.Reminders)
            .HasForeignKey(r => r.AdministeredVaccineId)
            .IsRequired(false);
    }
}