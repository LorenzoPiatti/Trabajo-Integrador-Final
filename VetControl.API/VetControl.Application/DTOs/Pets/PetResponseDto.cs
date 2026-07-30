namespace VetControl.Application.DTOs.Pets;

public class PetResponseDto
{
    public int PetId { get; set; }

    public int OwnerId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Species { get; set; } = string.Empty;

    public string Breed { get; set; } = string.Empty;

    public DateTime BirthDate { get; set; }

    public string? Observations { get; set; }
}
