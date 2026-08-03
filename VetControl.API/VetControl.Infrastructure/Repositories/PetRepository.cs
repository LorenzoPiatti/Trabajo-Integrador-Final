using Microsoft.EntityFrameworkCore;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Infrastructure.Data;

namespace VetControl.Infrastructure.Repositories;

public class PetRepository : IPetRepository
{
    private readonly VetControlDbContext _context;

    public PetRepository(VetControlDbContext context)
    {
        _context = context;
    }

    public async Task<List<Pet>> GetByOwnerUserIdAsync(int userId)
    {
        return await _context.Pets
            .AsNoTracking()
            .Where(p => p.Owner.UserId == userId)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<Pet?> GetByIdForOwnerUserIdAsync(
        int petId,
        int userId)
    {
        return await _context.Pets
            .FirstOrDefaultAsync(p =>
                p.PetId == petId &&
                p.Owner.UserId == userId);
    }

    public async Task<int?> GetOwnerIdByUserIdAsync(int userId)
    {
        return await _context.Owners
            .Where(o => o.UserId == userId)
            .Select(o => (int?)o.OwnerId)
            .FirstOrDefaultAsync();
    }

    public async Task<Pet?> GetByIdAsync(int petId)
    {
        return await _context.Pets
            .FirstOrDefaultAsync(p =>
                p.PetId == petId);
    }

    public async Task<bool> BelongsToOwnerAsync(
        int petId,
        int ownerId)
    {
        return await _context.Pets
            .AnyAsync(p =>
                p.PetId == petId &&
                p.OwnerId == ownerId);
    }

    public async Task AddAsync(Pet pet)
    {
        await _context.Pets.AddAsync(pet);
    }

    public Task UpdateAsync(Pet pet)
    {
        _context.Pets.Update(pet);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Pet pet)
    {
        _context.Pets.Remove(pet);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}