using VetControl.Application.DTOs.MedicalRecords;

namespace VetControl.Application.Interfaces;

public interface IMedicalRecordService
{
    Task<MedicalRecordResponseDto> RegisterAsync(
        int veterinarianId,
        CreateMedicalRecordDto dto);

    Task<List<MedicalRecordResponseDto>> GetPetHistoryAsync(
        int petId,
        int userId,
        string role);

    Task<MedicalRecordResponseDto?> GetByAppointmentAsync(
        int appointmentId);

    Task<List<MedicalRecordPetDto>> GetPetsByVeterinarianAsync(
    int veterinarianId);
}