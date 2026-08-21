namespace VetControl.Application.DTOs.Users;

public class UserActivitySummaryDto
{
    public int PetsCount { get; set; }

    public int AppointmentsCount { get; set; }

    public int MedicalRecordsCount { get; set; }

    public int AdministeredVaccinesCount { get; set; }

    public int RemindersCount { get; set; }

    public bool HasAssociatedData =>
        PetsCount > 0 ||
        AppointmentsCount > 0 ||
        MedicalRecordsCount > 0 ||
        AdministeredVaccinesCount > 0 ||
        RemindersCount > 0;
}
