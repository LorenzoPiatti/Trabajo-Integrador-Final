using VetControl.Application.DTOs.Profile;

namespace VetControl.Application.Interfaces;

public interface IProfileService
{
    Task<ProfileResponseDto> GetProfileAsync(int userId);

    Task<ProfileResponseDto> UpdateProfileAsync(
        int userId,
        UpdateProfileRequestDto request);
}