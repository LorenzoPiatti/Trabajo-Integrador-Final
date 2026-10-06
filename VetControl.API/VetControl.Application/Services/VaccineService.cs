using VetControl.Application.DTOs.Vaccines;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;

namespace VetControl.Application.Services;

public class VaccineService : IVaccineService
{
    private readonly IVaccineRepository _vaccineRepository;
    private readonly IOwnerRepository _ownerRepository;

    public VaccineService(
        IVaccineRepository vaccineRepository,
        IOwnerRepository ownerRepository)
    {
        _vaccineRepository = vaccineRepository;
        _ownerRepository = ownerRepository;
    }

    public async Task<List<VaccineResponseDto>> GetVaccinesAsync()
    {
        var vaccines =
            await _vaccineRepository.GetVaccinesAsync();

        return vaccines
            .Select(MapToVaccineResponseDto)
            .ToList();
    }

    public async Task<VaccineResponseDto> CreateVaccineAsync(
        CreateVaccineRequestDto dto)
    {
        ValidateVaccineData(
            dto.Name,
            dto.FrequencyMonths,
            dto.Stock);

        var vaccine = new Vaccine
        {
            Name = dto.Name.Trim(),
            Description = NormalizeObservations(
                dto.Description),
            FrequencyMonths = dto.FrequencyMonths,
            Stock = dto.Stock
        };

        await _vaccineRepository.AddVaccineAsync(
            vaccine);

        await _vaccineRepository.SaveChangesAsync();

        return MapToVaccineResponseDto(
            vaccine);
    }

    public async Task UpdateVaccineAsync(
        int vaccineId,
        UpdateVaccineRequestDto dto)
    {
        ValidateVaccineData(
            dto.Name,
            dto.FrequencyMonths,
            dto.Stock);

        var vaccine =
            await _vaccineRepository
                .GetVaccineByIdAsync(vaccineId);

        if (vaccine is null)
        {
            throw new Exception(
                "La vacuna no existe.");
        }

        vaccine.Name = dto.Name.Trim();
        vaccine.Description =
            NormalizeObservations(dto.Description);
        vaccine.FrequencyMonths = dto.FrequencyMonths;

    
        vaccine.Stock += dto.Stock;

        await _vaccineRepository.UpdateVaccineAsync(
            vaccine);

        await _vaccineRepository.SaveChangesAsync();
    }

    public async Task DeleteVaccineAsync(
        int vaccineId)
    {
        var vaccine =
            await _vaccineRepository
                .GetVaccineByIdAsync(vaccineId);

        if (vaccine is null)
        {
            throw new Exception(
                "La vacuna no existe.");
        }

        var administeredCount =
            await _vaccineRepository
                .CountAdministeredByVaccineAsync(
                    vaccineId);

        if (administeredCount > 0)
        {
            throw new Exception(
                "No se puede eliminar una vacuna con aplicaciones registradas. Puede dejar el stock en 0.");
        }

        await _vaccineRepository.DeleteVaccineAsync(
            vaccine);

        await _vaccineRepository.SaveChangesAsync();
    }

    public async Task<List<AdministeredVaccineResponseDto>>
        GetMyVaccinesAsync(int userId)
    {
        var owner =
            await GetOwnerOrThrowAsync(userId);

        var administeredVaccines =
            await _vaccineRepository
                .GetAdministeredByOwnerAsync(
                    owner.OwnerId);

        return administeredVaccines
            .Select(MapToAdministeredResponseDto)
            .ToList();
    }

    public async Task<AdministeredVaccineResponseDto?>
        GetByIdAsync(
            int administeredVaccineId,
            int userId)
    {
        var owner =
            await GetOwnerOrThrowAsync(userId);

        var administeredVaccine =
            await _vaccineRepository
                .GetAdministeredByIdAsync(
                    administeredVaccineId);

        if (administeredVaccine is null)
        {
            return null;
        }

        ValidateOwnerAccess(
            administeredVaccine,
            owner.OwnerId);

        return MapToAdministeredResponseDto(
            administeredVaccine);
    }

    private async Task<Owner> GetOwnerOrThrowAsync(
        int userId)
    {
        var owner =
            await _ownerRepository.GetByUserIdAsync(
                userId);

        if (owner is null)
        {
            throw new Exception(
                "El propietario no existe.");
        }

        return owner;
    }

    private static void ValidateOwnerAccess(
        AdministeredVaccine administeredVaccine,
        int ownerId)
    {
        if (administeredVaccine.Pet.OwnerId != ownerId)
        {
            throw new Exception(
                "No puede acceder a una vacuna que no pertenece a sus mascotas.");
        }
    }

    private static string? NormalizeObservations(
        string? observations)
    {
        return string.IsNullOrWhiteSpace(observations)
            ? null
            : observations.Trim();
    }

    private static void ValidateVaccineData(
        string name,
        int frequencyMonths,
        int stock)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new Exception(
                "El nombre de la vacuna es obligatorio.");
        }

        if (frequencyMonths <= 0)
        {
            throw new Exception(
                "La frecuencia debe ser mayor a 0.");
        }

        if (stock < 0)
        {
            throw new Exception(
                "El stock no puede ser negativo.");
        }
    }

    private static VaccineResponseDto MapToVaccineResponseDto(
        Vaccine vaccine)
    {
        return new VaccineResponseDto
        {
            VaccineId = vaccine.VaccineId,
            Name = vaccine.Name,
            Description = vaccine.Description,
            FrequencyMonths = vaccine.FrequencyMonths,
            Stock = vaccine.Stock
        };
    }

    private static AdministeredVaccineResponseDto
        MapToAdministeredResponseDto(
            AdministeredVaccine administeredVaccine)
    {
        return new AdministeredVaccineResponseDto
        {
            AdministeredVaccineId =
                administeredVaccine.AdministeredVaccineId,
            VaccineId =
                administeredVaccine.VaccineId,
            VaccineName =
                administeredVaccine.Vaccine.Name,
            PetId =
                administeredVaccine.PetId,
            PetName =
                administeredVaccine.Pet.Name,
            VeterinarianId =
                administeredVaccine.VeterinarianId,
            VeterinarianName =
                administeredVaccine.Veterinarian.Name,
            ApplicationDate =
                administeredVaccine.ApplicationDate,
            NextDueDate =
                administeredVaccine.NextDueDate,
            Observations =
                administeredVaccine.Observations
        };
    }
}