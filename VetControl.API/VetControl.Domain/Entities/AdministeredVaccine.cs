namespace VetControl.Domain.Entities;

public class AdministeredVaccine
{
    public int AdministeredVaccineId { get; set; }

    public int VaccineId { get; set; }

    public int PetId { get; set; }

    public int VeterinarianId { get; set; }

    public DateTime ApplicationDate { get; set; }

    public DateTime NextDueDate { get; set; }

    public string? Observations { get; set; }

    public Vaccine Vaccine { get; set; } = null!;

    public Pet Pet { get; set; } = null!;

    public User Veterinarian { get; set; } = null!;

    public ICollection<Reminder> Reminders { get; set; }
        = new List<Reminder>();
}