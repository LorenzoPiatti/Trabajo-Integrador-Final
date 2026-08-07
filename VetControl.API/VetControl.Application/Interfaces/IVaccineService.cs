using VetControl.Application.DTOs.Vaccines;

namespace VetControl.Application.Interfaces;

public interface IVaccineService
{
    Task<List<VaccineResponseDto>> GetVaccinesAsync();

    Task<List<AdministeredVaccineResponseDto>> GetMyVaccinesAsync(
        int userId);

    Task<AdministeredVaccineResponseDto?> GetByIdAsync(
        int administeredVaccineId,
        int userId);

    Task<AdministeredVaccineResponseDto> CreateAsync(
        int userId,
        CreateAdministeredVaccineDto dto);

    Task UpdateAsync(
        int administeredVaccineId,
        int userId,
        UpdateAdministeredVaccineDto dto);

    Task DeleteAsync(
        int administeredVaccineId,
        int userId);
}
