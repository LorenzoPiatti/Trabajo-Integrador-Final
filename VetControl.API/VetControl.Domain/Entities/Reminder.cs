using VetControl.Domain.Enums;

namespace VetControl.Domain.Entities;

public class Reminder
{
    public int ReminderId { get; set; }

    public int OwnerId { get; set; }

    public DateTime ReminderDate { get; set; }

    public ReminderType Type { get; set; }

    public bool Sent { get; set; } = false;

    public int? AppointmentId { get; set; }

    public int? AdministeredVaccineId { get; set; }


    public Owner Owner { get; set; } = null!;

    public Appointment? Appointment { get; set; }

    public AdministeredVaccine? AdministeredVaccine { get; set; }
}