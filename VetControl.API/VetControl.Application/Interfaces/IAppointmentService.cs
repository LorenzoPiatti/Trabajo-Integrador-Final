using VetControl.Application.DTOs.Appointments;

namespace VetControl.Application.Interfaces;

public interface IAppointmentService
{
    Task<AppointmentResponseDto> CreateAsync(
        int userId,
        CreateAppointmentDto dto);

    Task<List<AppointmentAvailabilityDto>> GetAvailabilityAsync(
        int veterinarianId,
        DateTime date);

    Task<List<AppointmentResponseDto>> GetByOwnerAsync(
        int userId);

    Task<AppointmentResponseDto?> GetByIdAsync(
        int appointmentId,
        int userId);

    Task UpdateAsync(
        int appointmentId,
        int userId,
        UpdateAppointmentDto dto);

    Task CancelAsync(
        int appointmentId,
        int userId);
}