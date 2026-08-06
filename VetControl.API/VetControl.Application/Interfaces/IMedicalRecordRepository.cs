using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IMedicalRecordRepository
{
    Task AddAsync(MedicalRecord medicalRecord);

    Task<MedicalRecord?> GetByAppointmentIdAsync(
        int appointmentId);

    Task<List<MedicalRecord>> GetByPetIdAsync(
        int petId);

    Task<bool> ExistsByAppointmentIdAsync(
        int appointmentId);

    Task<List<Pet>> GetPetsByVeterinarianAsync(
    int veterinarianId);

    Task<bool> HasVeterinarianAttendedPetAsync(
        int veterinarianId,
        int petId);

    Task SaveChangesAsync();
}