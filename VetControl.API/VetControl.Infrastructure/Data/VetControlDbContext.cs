using Microsoft.EntityFrameworkCore;
using VetControl.Domain.Entities;
using VetControl.Infrastructure.Configurations;

namespace VetControl.Infrastructure.Data
{
    public class VetControlDbContext : DbContext
    {
        public VetControlDbContext(DbContextOptions<VetControlDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Owner> Owners { get; set; }

        public DbSet<Pet> Pets { get; set; }

        public DbSet<Appointment> Appointments { get; set; }

        public DbSet<MedicalRecord> MedicalRecords { get; set; }

        public DbSet<Vaccine> Vaccines { get; set; }

        public DbSet<AdministeredVaccine> AdministeredVaccines { get; set; }

        public DbSet<Reminder> Reminders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UserConfiguration());

            modelBuilder.ApplyConfiguration(new OwnerConfiguration());

            modelBuilder.ApplyConfiguration(new PetConfiguration());

            modelBuilder.ApplyConfiguration(new AppointmentConfiguration());

            modelBuilder.ApplyConfiguration(new MedicalRecordConfiguration());

            modelBuilder.ApplyConfiguration(new VaccineConfiguration());

            modelBuilder.ApplyConfiguration(new AdministeredVaccineConfiguration());

            modelBuilder.ApplyConfiguration(new ReminderConfiguration());
        }
    }
}