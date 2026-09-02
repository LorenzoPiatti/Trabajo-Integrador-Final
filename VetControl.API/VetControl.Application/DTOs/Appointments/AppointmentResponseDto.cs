namespace VetControl.Application.DTOs.Appointments;

public class AppointmentResponseDto
{
    public int AppointmentId { get; set; }

    public int PetId { get; set; }

    public string PetName { get; set; } = string.Empty;

    public int OwnerId { get; set; }

    public string OwnerName { get; set; } = string.Empty;

    public string OwnerEmail { get; set; } = string.Empty;

    public int VeterinarianId { get; set; }

    public string VeterinarianName { get; set; } = string.Empty;

    public DateTime DateTime { get; set; }

    public string Reason { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;
}
