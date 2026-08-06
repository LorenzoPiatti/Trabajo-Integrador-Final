using Microsoft.EntityFrameworkCore;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Infrastructure.Data;

namespace VetControl.Infrastructure.Repositories;

public class MedicalRecordRepository : IMedicalRecordRepository
{
    private readonly VetControlDbContext _context;

    public MedicalRecordRepository(VetControlDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(MedicalRecord medicalRecord)
    {
        await _context.MedicalRecords.AddAsync(medicalRecord);
    }

    public async Task<MedicalRecord?> GetByAppointmentIdAsync(
        int appointmentId)
    {
        return await _context.MedicalRecords
            .Include(m => m.Pet)
            .Include(m => m.Veterinarian)
            .FirstOrDefaultAsync(m =>
                m.AppointmentId == appointmentId);
    }

    public async Task<List<MedicalRecord>> GetByPetIdAsync(
        int petId)
    {
        return await _context.MedicalRecords
            .Include(m => m.Veterinarian)
            .Where(m => m.PetId == petId)
            .OrderByDescending(m => m.Date)
            .ToListAsync();
    }
    public async Task<bool> ExistsByAppointmentIdAsync(
    int appointmentId)
    {
        return await _context.MedicalRecords
            .AnyAsync(m =>
                m.AppointmentId == appointmentId);
    }

    public async Task<List<Pet>> GetPetsByVeterinarianAsync(
    int veterinarianId)
    {
        return await _context.MedicalRecords
            .AsNoTracking()
            .Where(m =>
                m.VeterinarianId == veterinarianId)
            .Select(m => m.Pet)
            .Distinct()
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<bool> HasVeterinarianAttendedPetAsync(
        int veterinarianId,
        int petId)
    {
        return await _context.MedicalRecords
            .AnyAsync(m =>
                m.VeterinarianId == veterinarianId &&
                m.PetId == petId);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

}