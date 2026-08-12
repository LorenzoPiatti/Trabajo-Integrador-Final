using System.ComponentModel.DataAnnotations;

namespace VetControl.Application.DTOs.Profile;

public class UpdateProfileRequestDto
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [MaxLength(
        100,
        ErrorMessage = "El nombre no puede superar los 100 caracteres.")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(
        50,
        ErrorMessage = "El nombre no puede superar los 50 caracteres.")]
    public string? FirstName { get; set; }

    [MaxLength(
        50,
        ErrorMessage = "El apellido no puede superar los 50 caracteres.")]
    public string? LastName { get; set; }

    [MaxLength(
        30,
        ErrorMessage = "El teléfono no puede superar los 30 caracteres.")]
    public string? Phone { get; set; }

    [MaxLength(
        150,
        ErrorMessage = "La dirección no puede superar los 150 caracteres.")]
    public string? Address { get; set; }
}