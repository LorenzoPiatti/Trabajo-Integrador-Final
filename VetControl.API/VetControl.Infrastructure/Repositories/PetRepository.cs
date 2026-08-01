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
}