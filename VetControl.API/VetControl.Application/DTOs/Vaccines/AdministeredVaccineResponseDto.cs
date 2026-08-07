namespace VetControl.Application.DTOs.Vaccines;

public class AdministeredVaccineResponseDto
{
    public int AdministeredVaccineId { get; set; }

    public int VaccineId { get; set; }

    public string VaccineName { get; set; } = string.Empty;

    public int PetId { get; set; }

    public string PetName { get; set; } = string.Empty;

    public int VeterinarianId { get; set; }

    public string VeterinarianName { get; set; } = string.Empty;

    public DateTime ApplicationDate { get; set; }

    public DateTime NextDueDate { get; set; }

    public string? Observations { get; set; }
}
