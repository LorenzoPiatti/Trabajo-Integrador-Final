using VetControl.Domain.Enums;

namespace VetControl.Domain.Entities;

public class User
{
    public int UserId { get; set; }

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public bool Active { get; set; } = true;


    public Owner? Owner { get; set; }

    public ICollection<Appointment> Appointments { get; set; }
        = new List<Appointment>();

    public ICollection<MedicalRecord> MedicalRecords { get; set; }
        = new List<MedicalRecord>();

    public ICollection<AdministeredVaccine> AdministeredVaccines { get; set; }
        = new List<AdministeredVaccine>();

    public bool EmailVerified { get; set; } = false;

    public string? VerificationCode { get; set; }
}