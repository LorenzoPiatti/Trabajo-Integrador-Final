using Microsoft.EntityFrameworkCore;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Infrastructure.Data;

namespace VetControl.Infrastructure.Repositories;

public class OwnerRepository : IOwnerRepository
{
    private readonly VetControlDbContext _context;

    public OwnerRepository(
        VetControlDbContext context)
    {
        _context = context;
    }

    public async Task<Owner?> GetByUserIdAsync(
        int userId)
    {
        return await _context.Owners
            .FirstOrDefaultAsync(o =>
                o.UserId == userId);
    }
}