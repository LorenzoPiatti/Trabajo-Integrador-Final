namespace VetControl.Application.DTOs.Reminders;

public class ReminderResponseDto
{
    public int ReminderId { get; set; }

    public DateTime ReminderDate { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? AppointmentId { get; set; }

    public int? AdministeredVaccineId { get; set; }
}