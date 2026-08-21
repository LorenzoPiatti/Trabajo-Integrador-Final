namespace VetControl.Application.DTOs.Users;

public class UserManagementResponseDto
{
    public int UserId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public bool Active { get; set; }

    public bool EmailVerified { get; set; }

    public string? OwnerFullName { get; set; }

    public int PetsCount { get; set; }

    public int AppointmentsCount { get; set; }

    public int MedicalRecordsCount { get; set; }

    public int AdministeredVaccinesCount { get; set; }

    public int RemindersCount { get; set; }

    public bool HasAssociatedData { get; set; }
}
