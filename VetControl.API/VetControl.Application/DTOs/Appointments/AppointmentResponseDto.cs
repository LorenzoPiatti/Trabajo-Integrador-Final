namespace VetControl.Application.DTOs.Appointments;

public class AppointmentResponseDto
{
    public int AppointmentId { get; set; }

    public int PetId { get; set; }

    public string PetName { get; set; } = string.Empty;

    public int VeterinarianId { get; set; }

    public string VeterinarianEmail { get; set; } = string.Empty;

    public DateTime DateTime { get; set; }

    public string Reason { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;
}