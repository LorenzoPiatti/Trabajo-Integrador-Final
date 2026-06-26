namespace VetControl.Domain.Entities;

public class Vaccine
{
    public int VaccineId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int FrequencyMonths { get; set; }

    public int Stock { get; set; } = 0;

    // Navegación

    public ICollection<AdministeredVaccine> AdministeredVaccines { get; set; }
        = new List<AdministeredVaccine>();
}