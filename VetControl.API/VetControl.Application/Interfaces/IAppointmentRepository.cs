using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IAppointmentRepository
{
    Task<Appointment?> GetByIdAsync(int appointmentId);

    Task<List<Appointment>> GetByVeterinarianAndDateAsync(
        int veterinarianId,
        DateTime date);

    Task<List<Appointment>> GetByOwnerAsync(
        int ownerId);
    Task<List<Appointment>> GetCompletedByVeterinarianAsync(
    int veterinarianId);

    Task<List<Appointment>> GetPendingByVeterinarianAsync(
    int veterinarianId);

    Task AddAsync(
        Appointment appointment);

    Task UpdateAsync(
        Appointment appointment);

    Task SaveChangesAsync();
}