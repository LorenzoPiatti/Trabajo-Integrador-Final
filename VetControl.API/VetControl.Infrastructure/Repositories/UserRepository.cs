using Microsoft.EntityFrameworkCore;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;
using VetControl.Infrastructure.Data;

namespace VetControl.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly VetControlDbContext _context;

    public UserRepository(VetControlDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int userId)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == userId);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
    }

    public Task UpdateAsync(User user)
    {
        _context.Users.Update(user);

        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<List<User>> GetVeterinariansAsync()
    {
        return await _context.Users
            .Where(u =>
                u.Role == UserRole.Veterinarian &&
                u.Active)
            .ToListAsync();
    }
}