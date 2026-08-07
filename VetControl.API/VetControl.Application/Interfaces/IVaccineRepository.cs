using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IVaccineRepository
{
    Task<List<Vaccine>> GetVaccinesAsync();

    Task<Vaccine?> GetVaccineByIdAsync(
        int vaccineId);

    Task<List<AdministeredVaccine>> GetAdministeredByOwnerAsync(
        int ownerId);

    Task<AdministeredVaccine?> GetAdministeredByIdAsync(
        int administeredVaccineId);

    Task AddAdministeredAsync(
        AdministeredVaccine administeredVaccine);

    Task UpdateAdministeredAsync(
        AdministeredVaccine administeredVaccine);

    Task DeleteAdministeredAsync(
        AdministeredVaccine administeredVaccine);

    Task SaveChangesAsync();
}
