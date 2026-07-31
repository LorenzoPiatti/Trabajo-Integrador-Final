using System.ComponentModel.DataAnnotations;

namespace VetControl.Application.DTOs.Pets;

public class UpdatePetRequestDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Species { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Breed { get; set; } = string.Empty;

    [Required]
    public DateTime BirthDate { get; set; }

    public string? Observations { get; set; }
}
