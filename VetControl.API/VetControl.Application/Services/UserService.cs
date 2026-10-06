using VetControl.Application.DTOs.Users;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;

namespace VetControl.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;


    public UserService(
        IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<User>> GetVeterinariansAsync()
    {
        return await _userRepository.GetVeterinariansAsync();
    }

    public async Task<List<UserManagementResponseDto>> GetUsersAsync()
    {
        var users = await _userRepository.GetAllForManagementAsync();
        var result = new List<UserManagementResponseDto>();

        foreach (var user in users)
        {
            result.Add(await MapToManagementDtoAsync(user));
        }

        return result;
    }

    public async Task<UserManagementResponseDto> GetUserByIdAsync(
        int userId)
    {
        var user =
            await _userRepository.GetByIdForManagementAsync(userId)
            ?? throw new KeyNotFoundException("Usuario no encontrado.");

        return await MapToManagementDtoAsync(user);
    }

    public async Task<UserManagementResponseDto> UpdateRoleAsync(
        int currentAdminUserId,
        int userId,
        UpdateUserRoleRequestDto request)
    {
        var user =
            await _userRepository.GetByIdForManagementAsync(userId)
            ?? throw new KeyNotFoundException("Usuario no encontrado.");

        var newRole = ParseRole(request.Role);

        if (user.Role == newRole)
        {
            return await MapToManagementDtoAsync(user);
        }
        if (user.Role == UserRole.Owner || newRole == UserRole.Owner)
        {
            throw new InvalidOperationException(
                "El rol Propietario se gestiona mediante el registro de propietarios.");
        }

        if (user.UserId == currentAdminUserId &&
            user.Role == UserRole.Admin &&
            newRole != UserRole.Admin)
        {
            throw new InvalidOperationException(
                "No podes quitarte tu propio rol de administrador.");
        }

        if (user.Role == UserRole.Admin &&
            user.Active &&
            newRole != UserRole.Admin)
        {
            await EnsureAnotherActiveAdminExistsAsync();
        }

        var activitySummary =
            await _userRepository.GetActivitySummaryAsync(userId);

        if (activitySummary.HasAssociatedData)
        {
            throw new InvalidOperationException(
                "No se puede cambiar el rol de un usuario con datos asociados.");
        }

        user.Role = newRole;


        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();

        return await GetUserByIdAsync(user.UserId);
    }

    public async Task<UserManagementResponseDto> UpdateStatusAsync(
        int currentAdminUserId,
        int userId,
        UpdateUserStatusRequestDto request)
    {
        var user =
            await _userRepository.GetByIdForManagementAsync(userId)
            ?? throw new KeyNotFoundException("Usuario no encontrado.");

        if (user.Active == request.Active)
        {
            return await MapToManagementDtoAsync(user);
        }

        if (user.UserId == currentAdminUserId &&
            !request.Active)
        {
            throw new InvalidOperationException(
                "No podes desactivar tu propia cuenta.");
        }

        if (user.Role == UserRole.Admin &&
            user.Active &&
            !request.Active)
        {
            await EnsureAnotherActiveAdminExistsAsync();
        }

        user.Active = request.Active;

        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();

        return await MapToManagementDtoAsync(user);
    }

    private async Task<UserManagementResponseDto> MapToManagementDtoAsync(
        User user)
    {
        var activitySummary =
            await _userRepository.GetActivitySummaryAsync(user.UserId);

        return new UserManagementResponseDto
        {
            UserId = user.UserId,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString(),
            Active = user.Active,
            EmailVerified = user.EmailVerified,
            OwnerFullName = GetOwnerFullName(user.Owner),
            PetsCount = activitySummary.PetsCount,
            AppointmentsCount = activitySummary.AppointmentsCount,
            MedicalRecordsCount = activitySummary.MedicalRecordsCount,
            AdministeredVaccinesCount =
                activitySummary.AdministeredVaccinesCount,
            RemindersCount = activitySummary.RemindersCount,
            HasAssociatedData = activitySummary.HasAssociatedData
        };
    }

    private async Task EnsureAnotherActiveAdminExistsAsync()
    {
        var activeAdmins = await _userRepository.CountActiveAdminsAsync();

        if (activeAdmins <= 1)
        {
            throw new InvalidOperationException(
                "Debe quedar al menos un administrador activo.");
        }
    }

    private static UserRole ParseRole(string role)
    {
        if (string.IsNullOrWhiteSpace(role))
        {
            throw new InvalidOperationException("El rol es obligatorio.");
        }

        if (!Enum.TryParse(
                role.Trim(),
                ignoreCase: true,
                out UserRole parsedRole) ||
            !Enum.IsDefined(typeof(UserRole), parsedRole))
        {
            throw new InvalidOperationException("Rol invalido.");
        }

        return parsedRole;
    }

    private static string? GetOwnerFullName(Owner? owner)
    {
        if (owner == null)
        {
            return null;
        }

        return $"{owner.FirstName} {owner.LastName}".Trim();
    }
}
