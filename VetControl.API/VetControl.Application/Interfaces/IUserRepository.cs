using VetControl.Application.DTOs.Users;
using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);

    Task<User?> GetByIdAsync(int userId);

    Task<User?> GetByIdForManagementAsync(int userId);

    Task<List<User>> GetAllForManagementAsync();

    Task AddAsync(User user);

    Task UpdateAsync(User user);

    Task<List<User>> GetVeterinariansAsync();

    Task<int> CountActiveAdminsAsync();

    Task<UserActivitySummaryDto> GetActivitySummaryAsync(int userId);

    Task SaveChangesAsync();
}
