using Microsoft.EntityFrameworkCore;
using VetControl.Application.DTOs.Users;
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

    public async Task<User?> GetByIdForManagementAsync(int userId)
    {
        return await _context.Users
            .Include(u => u.Owner)
            .FirstOrDefaultAsync(u => u.UserId == userId);
    }

    public async Task<List<User>> GetAllForManagementAsync()
    {
        return await _context.Users
            .Include(u => u.Owner)
            .OrderBy(u => u.Name)
            .ToListAsync();
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

    public async Task<int> CountActiveAdminsAsync()
    {
        return await _context.Users
            .CountAsync(u =>
                u.Role == UserRole.Admin &&
                u.Active);
    }

    public async Task<UserActivitySummaryDto> GetActivitySummaryAsync(
        int userId)
    {
        var appointmentIds =
            _context.Appointments
                .Where(a =>
                    a.VeterinarianId == userId ||
                    a.Pet.Owner.UserId == userId)
                .Select(a => a.AppointmentId);

        var medicalRecordIds =
            _context.MedicalRecords
                .Where(m =>
                    m.VeterinarianId == userId ||
                    m.Pet.Owner.UserId == userId)
                .Select(m => m.MedicalRecordId);

        var administeredVaccineIds =
            _context.AdministeredVaccines
                .Where(av =>
                    av.VeterinarianId == userId ||
                    av.Pet.Owner.UserId == userId)
                .Select(av => av.AdministeredVaccineId);

        return new UserActivitySummaryDto
        {
            PetsCount = await _context.Pets
                .CountAsync(p => p.Owner.UserId == userId),
            AppointmentsCount = await appointmentIds
                .Distinct()
                .CountAsync(),
            MedicalRecordsCount = await medicalRecordIds
                .Distinct()
                .CountAsync(),
            AdministeredVaccinesCount = await administeredVaccineIds
                .Distinct()
                .CountAsync(),
            RemindersCount = await _context.Reminders
                .CountAsync(r => r.Owner.UserId == userId)
        };
    }
}
