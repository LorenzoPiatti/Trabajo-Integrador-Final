using VetControl.Application.DTOs.Users;
using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IUserService
{
    Task<IEnumerable<User>> GetVeterinariansAsync();

    Task<List<UserManagementResponseDto>> GetUsersAsync();

    Task<UserManagementResponseDto> GetUserByIdAsync(int userId);

    Task<UserManagementResponseDto> UpdateRoleAsync(
        int currentAdminUserId,
        int userId,
        UpdateUserRoleRequestDto request);

    Task<UserManagementResponseDto> UpdateStatusAsync(
        int currentAdminUserId,
        int userId,
        UpdateUserStatusRequestDto request);
}
