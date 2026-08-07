namespace VetControl.Application.DTOs.Vaccines;

public class VaccineResponseDto
{
    public int VaccineId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int FrequencyMonths { get; set; }

    public int Stock { get; set; }
}
