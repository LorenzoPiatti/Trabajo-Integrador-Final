using VetControl.Domain.Enums;

namespace VetControl.Domain.Entities;

public class Appointment
{
    public int AppointmentId { get; set; }

    public int PetId { get; set; }

    public int VeterinarianId { get; set; }

    public DateTime DateTime { get; set; }

    public string Reason { get; set; } = string.Empty;

    public AppointmentStatus Status { get; set; }
        = AppointmentStatus.Confirmed;


    public Pet Pet { get; set; } = null!;

    public User Veterinarian { get; set; } = null!;

    public ICollection<Reminder> Reminders { get; set; }
        = new List<Reminder>();
}