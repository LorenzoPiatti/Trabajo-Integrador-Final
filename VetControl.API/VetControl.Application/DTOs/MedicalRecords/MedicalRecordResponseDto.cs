namespace VetControl.Application.DTOs.MedicalRecords;

public class MedicalRecordResponseDto
{
    public int MedicalRecordId { get; set; }

    public int AppointmentId { get; set; }

    public int PetId { get; set; }

    public string PetName { get; set; } = string.Empty;

    public int VeterinarianId { get; set; }

    public string VeterinarianName { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    public string Description { get; set; } = string.Empty;

    public string? Diagnosis { get; set; }

    public string Treatment { get; set; } = string.Empty;
}