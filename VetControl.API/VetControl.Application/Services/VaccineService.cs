using VetControl.Application.DTOs.Vaccines;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;

namespace VetControl.Application.Services;

public class VaccineService : IVaccineService
{
    private readonly IVaccineRepository _vaccineRepository;
    private readonly IPetRepository _petRepository;
    private readonly IUserRepository _userRepository;
    private readonly IOwnerRepository _ownerRepository;

    public VaccineService(
        IVaccineRepository vaccineRepository,
        IPetRepository petRepository,
        IUserRepository userRepository,
        IOwnerRepository ownerRepository)
    {
        _vaccineRepository = vaccineRepository;
        _petRepository = petRepository;
        _userRepository = userRepository;
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

    public async Task<List<AdministeredVaccineResponseDto>> GetMyVaccinesAsync(
        int userId)
    {
        var owner =
            await GetOwnerOrThrowAsync(userId);

        var administeredVaccines =
            await _vaccineRepository
                .GetAdministeredByOwnerAsync(owner.OwnerId);

        return administeredVaccines
            .Select(MapToAdministeredResponseDto)
            .ToList();
    }

    public async Task<AdministeredVaccineResponseDto?> GetByIdAsync(
        int administeredVaccineId,
        int userId)
    {
        var owner =
            await GetOwnerOrThrowAsync(userId);

        var administeredVaccine =
            await _vaccineRepository
                .GetAdministeredByIdAsync(administeredVaccineId);

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

    public async Task<AdministeredVaccineResponseDto> CreateAsync(
        int userId,
        CreateAdministeredVaccineDto dto)
    {
        var validation =
            await ValidateAdministeredVaccineDataAsync(
                userId,
                dto.PetId,
                dto.VaccineId,
                dto.VeterinarianId,
                dto.ApplicationDate);

        var applicationDate =
            dto.ApplicationDate.Date;

        var nextDueDate =
            applicationDate.AddMonths(
                validation.Vaccine.FrequencyMonths);

        var administeredVaccine = new AdministeredVaccine
        {
            VaccineId = dto.VaccineId,
            PetId = dto.PetId,
            VeterinarianId = dto.VeterinarianId,
            ApplicationDate = applicationDate,
            NextDueDate = nextDueDate,
            Observations = NormalizeObservations(
                dto.Observations),
            Pet = validation.Pet,
            Vaccine = validation.Vaccine,
            Veterinarian = validation.Veterinarian
        };

        SyncVaccineReminder(
            administeredVaccine,
            validation.Owner.OwnerId);

        await _vaccineRepository.AddAdministeredAsync(
            administeredVaccine);

        await _vaccineRepository.SaveChangesAsync();

        return MapToAdministeredResponseDto(
            administeredVaccine);
    }

    public async Task UpdateAsync(
        int administeredVaccineId,
        int userId,
        UpdateAdministeredVaccineDto dto)
    {
        var owner =
            await GetOwnerOrThrowAsync(userId);

        var administeredVaccine =
            await _vaccineRepository
                .GetAdministeredByIdAsync(administeredVaccineId);

        if (administeredVaccine is null)
        {
            throw new Exception(
                "La vacuna aplicada no existe.");
        }

        ValidateOwnerAccess(
            administeredVaccine,
            owner.OwnerId);

        var validation =
            await ValidateAdministeredVaccineDataAsync(
                userId,
                dto.PetId,
                dto.VaccineId,
                dto.VeterinarianId,
                dto.ApplicationDate);

        var applicationDate =
            dto.ApplicationDate.Date;

        administeredVaccine.VaccineId = dto.VaccineId;
        administeredVaccine.PetId = dto.PetId;
        administeredVaccine.VeterinarianId = dto.VeterinarianId;
        administeredVaccine.ApplicationDate = applicationDate;
        administeredVaccine.NextDueDate =
            applicationDate.AddMonths(
                validation.Vaccine.FrequencyMonths);
        administeredVaccine.Observations =
            NormalizeObservations(dto.Observations);
        administeredVaccine.Pet = validation.Pet;
        administeredVaccine.Vaccine = validation.Vaccine;
        administeredVaccine.Veterinarian =
            validation.Veterinarian;

        SyncVaccineReminder(
            administeredVaccine,
            owner.OwnerId);

        await _vaccineRepository.UpdateAdministeredAsync(
            administeredVaccine);

        await _vaccineRepository.SaveChangesAsync();
    }

    public async Task DeleteAsync(
        int administeredVaccineId,
        int userId)
    {
        var owner =
            await GetOwnerOrThrowAsync(userId);

        var administeredVaccine =
            await _vaccineRepository
                .GetAdministeredByIdAsync(administeredVaccineId);

        if (administeredVaccine is null)
        {
            throw new Exception(
                "La vacuna aplicada no existe.");
        }

        ValidateOwnerAccess(
            administeredVaccine,
            owner.OwnerId);

        await _vaccineRepository.DeleteAdministeredAsync(
            administeredVaccine);

        await _vaccineRepository.SaveChangesAsync();
    }

    private async Task<Owner> GetOwnerOrThrowAsync(
        int userId)
    {
        var owner =
            await _ownerRepository.GetByUserIdAsync(userId);

        if (owner is null)
        {
            throw new Exception(
                "El propietario no existe.");
        }

        return owner;
    }

    private async Task<AdministeredVaccineValidation>
        ValidateAdministeredVaccineDataAsync(
            int userId,
            int petId,
            int vaccineId,
            int veterinarianId,
            DateTime applicationDate)
    {
        if (applicationDate == default)
        {
            throw new Exception(
                "La fecha de aplicacion es obligatoria.");
        }

        if (applicationDate.Date > DateTime.Today)
        {
            throw new Exception(
                "La fecha de aplicacion no puede ser futura.");
        }

        var owner =
            await GetOwnerOrThrowAsync(userId);

        var pet =
            await _petRepository.GetByIdAsync(petId);

        if (pet is null)
        {
            throw new Exception(
                "La mascota no existe.");
        }

        if (pet.OwnerId != owner.OwnerId)
        {
            throw new Exception(
                "La mascota no pertenece al propietario.");
        }

        var vaccine =
            await _vaccineRepository
                .GetVaccineByIdAsync(vaccineId);

        if (vaccine is null)
        {
            throw new Exception(
                "La vacuna no existe.");
        }

        if (vaccine.FrequencyMonths <= 0)
        {
            throw new Exception(
                "La vacuna no tiene una frecuencia valida.");
        }

        var veterinarian =
            await _userRepository.GetByIdAsync(
                veterinarianId);

        if (veterinarian is null)
        {
            throw new Exception(
                "El veterinario no existe.");
        }

        if (veterinarian.Role != UserRole.Veterinarian)
        {
            throw new Exception(
                "El usuario seleccionado no es un veterinario.");
        }

        return new AdministeredVaccineValidation(
            owner,
            pet,
            vaccine,
            veterinarian);
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

    private static void SyncVaccineReminder(
        AdministeredVaccine administeredVaccine,
        int ownerId)
    {
        var reminder =
            administeredVaccine.Reminders.FirstOrDefault(r =>
                r.Type == ReminderType.Vaccine);

        if (reminder is null)
        {
            administeredVaccine.Reminders.Add(
                new Reminder
                {
                    OwnerId = ownerId,
                    ReminderDate =
                        administeredVaccine.NextDueDate.Date,
                    Type = ReminderType.Vaccine,
                    Sent = false,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                });

            return;
        }

        reminder.OwnerId = ownerId;
        reminder.ReminderDate =
            administeredVaccine.NextDueDate.Date;
        reminder.Sent = false;
        reminder.IsRead = false;
        reminder.CreatedAt = DateTime.UtcNow;
    }

    private static string? NormalizeObservations(
        string? observations)
    {
        return string.IsNullOrWhiteSpace(observations)
            ? null
            : observations.Trim();
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

    private static AdministeredVaccineResponseDto MapToAdministeredResponseDto(
        AdministeredVaccine administeredVaccine)
    {
        return new AdministeredVaccineResponseDto
        {
            AdministeredVaccineId =
                administeredVaccine.AdministeredVaccineId,
            VaccineId = administeredVaccine.VaccineId,
            VaccineName = administeredVaccine.Vaccine.Name,
            PetId = administeredVaccine.PetId,
            PetName = administeredVaccine.Pet.Name,
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

    private sealed record AdministeredVaccineValidation(
        Owner Owner,
        Pet Pet,
        Vaccine Vaccine,
        User Veterinarian);
}
