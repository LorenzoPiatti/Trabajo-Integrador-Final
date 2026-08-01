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

    Task AddAsync(
        Appointment appointment);

    Task UpdateAsync(
        Appointment appointment);

    Task SaveChangesAsync();
}