namespace VetControl.Domain.Entities;

public class Pet
{
    public int PetId { get; set; }

    public int OwnerId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Species { get; set; } = string.Empty;

    public string Breed { get; set; } = string.Empty;

    public DateTime BirthDate { get; set; }

    public string? Observations { get; set; }

    public Owner Owner { get; set; } = null!;

    public ICollection<Appointment> Appointments { get; set; }
        = new List<Appointment>();

    public ICollection<MedicalRecord> MedicalRecords { get; set; }
        = new List<MedicalRecord>();

    public ICollection<AdministeredVaccine> AdministeredVaccines { get; set; }
        = new List<AdministeredVaccine>();
}