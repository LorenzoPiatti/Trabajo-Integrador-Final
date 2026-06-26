using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);

    Task AddAsync(User user);

    Task UpdateAsync(User user);

    Task SaveChangesAsync();
}