using Microsoft.EntityFrameworkCore;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Infrastructure.Data;

namespace VetControl.Infrastructure.Repositories;

public class VaccineRepository : IVaccineRepository
{
    private readonly VetControlDbContext _context;

    public VaccineRepository(
        VetControlDbContext context)
    {
        _context = context;
    }

    public async Task<List<Vaccine>> GetVaccinesAsync()
    {
        return await _context.Vaccines
            .AsNoTracking()
            .OrderBy(v => v.Name)
            .ToListAsync();
    }

    public async Task<Vaccine?> GetVaccineByIdAsync(
        int vaccineId)
    {
        return await _context.Vaccines
            .FirstOrDefaultAsync(v =>
                v.VaccineId == vaccineId);
    }

    public async Task<List<AdministeredVaccine>> GetAdministeredByOwnerAsync(
        int ownerId)
    {
        return await _context.AdministeredVaccines
            .AsNoTracking()
            .Include(av => av.Vaccine)
            .Include(av => av.Pet)
            .Include(av => av.Veterinarian)
            .Where(av =>
                av.Pet.OwnerId == ownerId)
            .OrderByDescending(av => av.ApplicationDate)
            .ToListAsync();
    }

    public async Task<AdministeredVaccine?> GetAdministeredByIdAsync(
        int administeredVaccineId)
    {
        return await _context.AdministeredVaccines
            .Include(av => av.Vaccine)
            .Include(av => av.Pet)
            .Include(av => av.Veterinarian)
            .Include(av => av.Reminders)
            .FirstOrDefaultAsync(av =>
                av.AdministeredVaccineId == administeredVaccineId);
    }

    public async Task AddAdministeredAsync(
        AdministeredVaccine administeredVaccine)
    {
        await _context.AdministeredVaccines.AddAsync(
            administeredVaccine);
    }

    public Task UpdateAdministeredAsync(
        AdministeredVaccine administeredVaccine)
    {
        _context.AdministeredVaccines.Update(
            administeredVaccine);

        return Task.CompletedTask;
    }

    public Task DeleteAdministeredAsync(
        AdministeredVaccine administeredVaccine)
    {
        _context.Reminders.RemoveRange(
            administeredVaccine.Reminders);

        _context.AdministeredVaccines.Remove(
            administeredVaccine);

        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
