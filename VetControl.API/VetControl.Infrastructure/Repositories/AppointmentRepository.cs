using Microsoft.EntityFrameworkCore;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;
using VetControl.Infrastructure.Data;

namespace VetControl.Infrastructure.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly VetControlDbContext _context;

    public AppointmentRepository(VetControlDbContext context)
    {
        _context = context;
    }

    public async Task<Appointment?> GetByIdAsync(
        int appointmentId)
    {
        return await _context.Appointments
            .Include(a => a.Pet)
            .Include(a => a.Veterinarian)
            .FirstOrDefaultAsync(a =>
                a.AppointmentId == appointmentId);
    }

    public async Task<List<Appointment>> GetByVeterinarianAndDateAsync(
        int veterinarianId,
        DateTime date)
    {
        return await _context.Appointments
            .Where(a =>
                a.VeterinarianId == veterinarianId &&
                a.DateTime.Date == date.Date &&
                a.Status != AppointmentStatus.Cancelled)
            .OrderBy(a => a.DateTime)
            .ToListAsync();
    }

    public async Task<List<Appointment>> GetCompletedByVeterinarianAsync(
        int veterinarianId)
    {
        return await _context.Appointments
            .Include(a => a.Pet)
            .Include(a => a.Veterinarian)
            .Include(a => a.MedicalRecord)
            .Where(a =>
                a.VeterinarianId == veterinarianId &&
                a.Status == AppointmentStatus.Completed)
            .OrderByDescending(a => a.DateTime)
            .ToListAsync();
    }

    public async Task<List<Appointment>> GetByOwnerAsync(
        int ownerId)
    {
        return await _context.Appointments
            .Include(a => a.Pet)
            .Include(a => a.Veterinarian)
            .Where(a =>
                a.Pet.OwnerId == ownerId)
            .OrderByDescending(a => a.DateTime)
            .ToListAsync();
    }

    public async Task<List<Appointment>> GetPendingByVeterinarianAsync(
    int veterinarianId)
    {
        return await _context.Appointments
            .Include(a => a.Pet)
            .Include(a => a.Veterinarian)
            .Where(a =>
                a.VeterinarianId == veterinarianId &&
                a.Status == AppointmentStatus.Confirmed)
            .OrderBy(a => a.DateTime)
            .ToListAsync();
    }
    public async Task AddAsync(
        Appointment appointment)
    {
        await _context.Appointments.AddAsync(appointment);
    }

    public Task UpdateAsync(
        Appointment appointment)
    {
        _context.Appointments.Update(appointment);

        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}