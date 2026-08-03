namespace VetControl.Application.DTOs.Appointments;

public class CreateAppointmentDto
{
    public int PetId { get; set; }

    public int VeterinarianId { get; set; }

    public DateTime DateTime { get; set; }

    public string Reason { get; set; } = string.Empty;
}