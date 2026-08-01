using VetControl.Application.DTOs.Pets;

namespace VetControl.Application.Interfaces;

public interface IPetService
{
    Task<List<PetResponseDto>> GetMyPetsAsync(int userId);

    Task<PetResponseDto> GetMyPetByIdAsync(
        int userId,
        int petId);

    Task<PetResponseDto> CreateAsync(
        int userId,
        CreatePetRequestDto request);

    Task<PetResponseDto> UpdateAsync(
        int userId,
        int petId,
        UpdatePetRequestDto request);

    Task DeleteAsync(
        int userId,
        int petId);
}
