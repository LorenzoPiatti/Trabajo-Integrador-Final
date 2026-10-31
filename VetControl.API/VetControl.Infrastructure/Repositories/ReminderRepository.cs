using Microsoft.EntityFrameworkCore;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;
using VetControl.Infrastructure.Data;

namespace VetControl.Infrastructure.Repositories;

public class ReminderRepository : IReminderRepository
{
    private readonly VetControlDbContext _context;

    public ReminderRepository(
        VetControlDbContext context)
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

    public async Task<int> GetUnreadCountAsync(
        int userId)
    {
        return await _context.Reminders
            .CountAsync(r =>
                r.Owner.UserId == userId &&
                !r.IsRead);
    }

    public async Task<List<Reminder>>
        GetPendingAppointmentRemindersAsync(
            DateTime currentDateTime)
    {
        return await _context.Reminders
            .Include(r => r.Owner)
                .ThenInclude(o => o.User)
            .Include(r => r.Appointment)
                .ThenInclude(a => a!.Pet)
            .Include(r => r.Appointment)
                .ThenInclude(a => a!.Veterinarian)
            .Where(r =>
                r.Type == ReminderType.Appointment &&
                !r.Sent &&
                r.ReminderDate <= currentDateTime &&
                r.AppointmentId != null &&
                r.Appointment != null &&
                r.Appointment.Status ==
                    AppointmentStatus.Confirmed &&
                r.Appointment.DateTime > currentDateTime)
            .OrderBy(r => r.ReminderDate)
            .ToListAsync();
    }

    public async Task<List<Reminder>>
        GetPendingVaccineRemindersAsync(
            DateTime currentDateTime)
    {
        return await _context.Reminders
            .Include(r => r.Owner)
                .ThenInclude(o => o.User)
            .Include(r => r.AdministeredVaccine)
                .ThenInclude(av => av!.Pet)
            .Include(r => r.AdministeredVaccine)
                .ThenInclude(av => av!.Vaccine)
            .Where(r =>
                r.Type == ReminderType.Vaccine &&
                !r.Sent &&
                r.ReminderDate <= currentDateTime &&
                r.AdministeredVaccineId != null &&
                r.AdministeredVaccine != null)
            .OrderBy(r => r.ReminderDate)
            .ToListAsync();
    }

    public async Task<Reminder?> GetByAppointmentIdAsync(
        int appointmentId)
    {
        return await _context.Reminders
            .FirstOrDefaultAsync(r =>
                r.Type == ReminderType.Appointment &&
                r.AppointmentId == appointmentId);
    }
    public async Task AddAsync(
        Reminder reminder)
    {
        await _context.Reminders
            .AddAsync(reminder);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}