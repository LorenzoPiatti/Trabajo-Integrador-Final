using VetControl.Application.DTOs.Vaccines;

namespace VetControl.Application.Interfaces;

public interface IVaccineService
{
    Task<List<VaccineResponseDto>> GetVaccinesAsync();

    Task<VaccineResponseDto> CreateVaccineAsync(
        CreateVaccineRequestDto dto);

    Task UpdateVaccineAsync(
        int vaccineId,
        UpdateVaccineRequestDto dto);

    Task DeleteVaccineAsync(
        int vaccineId);

    Task<List<AdministeredVaccineResponseDto>> GetMyVaccinesAsync(
        int userId);

    Task<AdministeredVaccineResponseDto?> GetByIdAsync(
        int administeredVaccineId,
        int userId);
}