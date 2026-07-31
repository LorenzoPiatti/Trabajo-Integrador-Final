using VetControl.Application.DTOs.Pets;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;

namespace VetControl.Application.Services;

public class PetService : IPetService
{
    private readonly IPetRepository _petRepository;

    public PetService(IPetRepository petRepository)
    {
        _petRepository = petRepository;
    }

    public async Task<List<PetResponseDto>> GetMyPetsAsync(int userId)
    {
        var pets = await _petRepository.GetByOwnerUserIdAsync(userId);

        return pets.Select(MapToDto).ToList();
    }

    public async Task<PetResponseDto> GetMyPetByIdAsync(
        int userId,
        int petId)
    {
        var pet = await GetPetForOwnerAsync(userId, petId);

        return MapToDto(pet);
    }

    public async Task<PetResponseDto> CreateAsync(
        int userId,
        CreatePetRequestDto request)
    {
        ValidatePetData(
            request.Name,
            request.Species,
            request.Breed,
            request.BirthDate);

        var ownerId = await _petRepository
            .GetOwnerIdByUserIdAsync(userId);

        if (ownerId == null)
        {
            throw new Exception(
                "El usuario no tiene un dueño asociado.");
        }

        var pet = new Pet
        {
            OwnerId = ownerId.Value,
            Name = request.Name.Trim(),
            Species = request.Species.Trim(),
            Breed = request.Breed.Trim(),
            BirthDate = request.BirthDate.Date,
            Observations = NormalizeOptionalText(
                request.Observations)
        };

        await _petRepository.AddAsync(pet);

        await _petRepository.SaveChangesAsync();

        return MapToDto(pet);
    }

    public async Task<PetResponseDto> UpdateAsync(
        int userId,
        int petId,
        UpdatePetRequestDto request)
    {
        ValidatePetData(
            request.Name,
            request.Species,
            request.Breed,
            request.BirthDate);

        var pet = await GetPetForOwnerAsync(userId, petId);

        pet.Name = request.Name.Trim();
        pet.Species = request.Species.Trim();
        pet.Breed = request.Breed.Trim();
        pet.BirthDate = request.BirthDate.Date;
        pet.Observations = NormalizeOptionalText(
            request.Observations);

        await _petRepository.UpdateAsync(pet);

        await _petRepository.SaveChangesAsync();

        return MapToDto(pet);
    }

    public async Task DeleteAsync(
        int userId,
        int petId)
    {
        var pet = await GetPetForOwnerAsync(userId, petId);

        await _petRepository.DeleteAsync(pet);

        await _petRepository.SaveChangesAsync();
    }

    private async Task<Pet> GetPetForOwnerAsync(
        int userId,
        int petId)
    {
        var pet = await _petRepository
            .GetByIdForOwnerUserIdAsync(petId, userId);

        if (pet == null)
        {
            throw new KeyNotFoundException(
                "Mascota no encontrada.");
        }

        return pet;
    }

    private static void ValidatePetData(
        string name,
        string species,
        string breed,
        DateTime birthDate)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new Exception(
                "El nombre de la mascota es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(species))
        {
            throw new Exception(
                "La especie de la mascota es obligatoria.");
        }

        if (string.IsNullOrWhiteSpace(breed))
        {
            throw new Exception(
                "La raza de la mascota es obligatoria.");
        }

        if (birthDate.Date > DateTime.UtcNow.Date)
        {
            throw new Exception(
                "La fecha de nacimiento no puede ser futura.");
        }
    }

    private static string? NormalizeOptionalText(string? text)
    {
        return string.IsNullOrWhiteSpace(text)
            ? null
            : text.Trim();
    }

    private static PetResponseDto MapToDto(Pet pet)
    {
        return new PetResponseDto
        {
            PetId = pet.PetId,
            OwnerId = pet.OwnerId,
            Name = pet.Name,
            Species = pet.Species,
            Breed = pet.Breed,
            BirthDate = pet.BirthDate,
            Observations = pet.Observations
        };
    }
}
