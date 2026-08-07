using Microsoft.EntityFrameworkCore;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Infrastructure.Data;

namespace VetControl.Infrastructure.Repositories;

public class ReminderRepository : IReminderRepository
{
    private readonly VetControlDbContext _context;

    public ReminderRepository(VetControlDbContext context)
    {
        _context = context;
    }

    public async Task<List<Reminder>> GetByOwnerUserIdAsync(
        int userId)
    {
        return await _context.Reminders
            .Include(r => r.Appointment)
                .ThenInclude(a => a!.Pet)
            .Include(r => r.AdministeredVaccine)
                .ThenInclude(av => av!.Pet)
            .Include(r => r.AdministeredVaccine)
                .ThenInclude(av => av!.Vaccine)
            .Where(r => r.Owner.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Reminder?> GetByIdForOwnerUserIdAsync(
        int reminderId,
        int userId)
    {
        return await _context.Reminders
            .Include(r => r.Appointment)
                .ThenInclude(a => a!.Pet)
            .Include(r => r.AdministeredVaccine)
                .ThenInclude(av => av!.Pet)
            .Include(r => r.AdministeredVaccine)
                .ThenInclude(av => av!.Vaccine)
            .FirstOrDefaultAsync(r =>
                r.ReminderId == reminderId &&
                r.Owner.UserId == userId);
    }

    public async Task<List<Reminder>> GetUnreadByOwnerUserIdAsync(
        int userId)
    {
        return await _context.Reminders
            .Include(r => r.Appointment)
                .ThenInclude(a => a!.Pet)
            .Include(r => r.AdministeredVaccine)
                .ThenInclude(av => av!.Pet)
            .Include(r => r.AdministeredVaccine)
                .ThenInclude(av => av!.Vaccine)
            .Where(r =>
                r.Owner.UserId == userId &&
                !r.IsRead)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _context.Reminders
            .CountAsync(r =>
                r.Owner.UserId == userId &&
                !r.IsRead);
    }

    public async Task AddAsync(Reminder reminder)
    {
        await _context.Reminders.AddAsync(reminder);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}