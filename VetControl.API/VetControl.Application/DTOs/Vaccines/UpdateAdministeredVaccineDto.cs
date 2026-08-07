namespace VetControl.Application.DTOs.Vaccines;

public class UpdateAdministeredVaccineDto
{
    public int VaccineId { get; set; }

    public int PetId { get; set; }

    public int VeterinarianId { get; set; }

    public DateTime ApplicationDate { get; set; }

    public string? Observations { get; set; }
}
