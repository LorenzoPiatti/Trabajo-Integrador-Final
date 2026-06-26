namespace VetControl.Domain.Entities;

public class MedicalRecord
{
    public int MedicalRecordId { get; set; }

    public int PetId { get; set; }

    public int VeterinarianId { get; set; }

    public DateTime Date { get; set; }

    public string Description { get; set; } = string.Empty;

    public string? Diagnosis { get; set; }

    public string Treatment { get; set; } = string.Empty;

    public Pet Pet { get; set; } = null!;

    public User Veterinarian { get; set; } = null!;
}