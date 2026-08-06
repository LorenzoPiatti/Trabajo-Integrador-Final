namespace VetControl.Application.DTOs.MedicalRecords;

public class CreateMedicalRecordDto
{
    public int AppointmentId { get; set; }

    public string Description { get; set; } = string.Empty;

    public string? Diagnosis { get; set; }

    public string Treatment { get; set; } = string.Empty;
}
