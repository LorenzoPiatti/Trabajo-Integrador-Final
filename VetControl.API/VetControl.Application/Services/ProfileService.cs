using VetControl.Application.DTOs.Profile;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;

namespace VetControl.Application.Services;

public class ProfileService : IProfileService
{
    private readonly IUserRepository _userRepository;
    private readonly IOwnerRepository _ownerRepository;

    public ProfileService(
        IUserRepository userRepository,
        IOwnerRepository ownerRepository)
    {
        _userRepository = userRepository;
        _ownerRepository = ownerRepository;
    }

    public async Task<ProfileResponseDto> GetProfileAsync(
        int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "Usuario no encontrado.");
        }

        Owner? owner = null;

        if (user.Role == UserRole.Owner)
        {
            owner = await _ownerRepository
                .GetByUserIdAsync(userId);
        }

        return MapToResponseDto(user, owner);
    }

    public async Task<ProfileResponseDto> UpdateProfileAsync(
        int userId,
        UpdateProfileRequestDto request)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "Usuario no encontrado.");
        }

        // El nombre general puede modificarse en todos los roles.
        user.Name = request.Name.Trim();

        Owner? owner = null;

        if (user.Role == UserRole.Owner)
        {
            owner = await _ownerRepository
                .GetByUserIdAsync(userId);

            if (owner is null)
            {
                throw new KeyNotFoundException(
                    "No se encontraron los datos del dueño.");
            }

            // Null significa que el campo no fue enviado.
            // Si fue enviado, se actualiza su valor.
            if (request.FirstName is not null)
            {
                owner.FirstName = request.FirstName.Trim();
            }

            if (request.LastName is not null)
            {
                owner.LastName = request.LastName.Trim();
            }

            if (request.Phone is not null)
            {
                owner.Phone = request.Phone.Trim();
            }

            if (request.Address is not null)
            {
                owner.Address = request.Address.Trim();
            }
        }

        await _userRepository.UpdateAsync(user);

        // Owner y User pertenecen al mismo DbContext.
        // Esta operación guarda todos los cambios pendientes.
        await _userRepository.SaveChangesAsync();

        return MapToResponseDto(user, owner);
    }

    private static ProfileResponseDto MapToResponseDto(
        User user,
        Owner? owner)
    {
        return new ProfileResponseDto
        {
            UserId = user.UserId,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString(),
            Active = user.Active,
            EmailVerified = user.EmailVerified,

            Owner = owner is null
                ? null
                : new OwnerProfileDto
                {
                    OwnerId = owner.OwnerId,
                    FirstName = owner.FirstName,
                    LastName = owner.LastName,
                    Phone = owner.Phone,
                    Address = owner.Address
                }
        };
    }
}