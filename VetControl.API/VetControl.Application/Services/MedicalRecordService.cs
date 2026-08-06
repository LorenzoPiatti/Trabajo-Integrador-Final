using VetControl.Application.DTOs.MedicalRecords;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;

namespace VetControl.Application.Services;

public class MedicalRecordService : IMedicalRecordService
{
    private readonly IMedicalRecordRepository _medicalRecordRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IPetRepository _petRepository;
    private readonly IOwnerRepository _ownerRepository;

    public MedicalRecordService(
        IMedicalRecordRepository medicalRecordRepository,
        IAppointmentRepository appointmentRepository,
        IPetRepository petRepository,
        IOwnerRepository ownerRepository)
    {
        _medicalRecordRepository = medicalRecordRepository;
        _appointmentRepository = appointmentRepository;
        _petRepository = petRepository;
        _ownerRepository = ownerRepository;
    }

    public async Task<MedicalRecordResponseDto> RegisterAsync(
    int veterinarianId,
    CreateMedicalRecordDto dto)
    {
        var appointment = await _appointmentRepository
            .GetByIdAsync(dto.AppointmentId);

        if (appointment == null)
        {
            throw new KeyNotFoundException(
                "El turno no existe.");
        }

        if (appointment.VeterinarianId != veterinarianId)
        {
            throw new UnauthorizedAccessException(
                "Solo el veterinario asignado puede registrar la atención.");
        }

        if (appointment.Status == AppointmentStatus.Cancelled)
        {
            throw new Exception(
                "No se puede registrar una atención para un turno cancelado.");
        }

        if (await _medicalRecordRepository
            .ExistsByAppointmentIdAsync(dto.AppointmentId))
        {
            throw new Exception(
                "Este turno ya posee un historial médico.");
        }

        var medicalRecord = new MedicalRecord
        {
            AppointmentId = appointment.AppointmentId,
            PetId = appointment.PetId,
            VeterinarianId = veterinarianId,
            Date = DateTime.Now,
            Description = dto.Description,
            Diagnosis = dto.Diagnosis,
            Treatment = dto.Treatment
        };

        appointment.Status = AppointmentStatus.Completed;

        await _medicalRecordRepository.AddAsync(medicalRecord);

        await _appointmentRepository.UpdateAsync(appointment);

        await _medicalRecordRepository.SaveChangesAsync();

        return new MedicalRecordResponseDto
        {
            MedicalRecordId = medicalRecord.MedicalRecordId,
            AppointmentId = medicalRecord.AppointmentId,
            PetId = medicalRecord.PetId,
            PetName = appointment.Pet.Name,
            VeterinarianId = medicalRecord.VeterinarianId,
            VeterinarianName = appointment.Veterinarian.Name,
            Date = medicalRecord.Date,
            Description = medicalRecord.Description,
            Diagnosis = medicalRecord.Diagnosis,
            Treatment = medicalRecord.Treatment
        };
    }

    public async Task<List<MedicalRecordResponseDto>> GetPetHistoryAsync(
        int petId,
        int userId,
        string role)
    {
        var pet = await _petRepository.GetByIdAsync(petId);

        if (pet == null)
        {
            throw new KeyNotFoundException(
                "La mascota no existe.");
        }

        if (role == UserRole.Owner.ToString())
        {
            var ownerId = await _petRepository
                .GetOwnerIdByUserIdAsync(userId);

            if (ownerId == null)
            {
                throw new UnauthorizedAccessException(
                    "No posee permisos.");
            }

            var belongsToOwner = await _petRepository
                .BelongsToOwnerAsync(
                    petId,
                    ownerId.Value);

            if (!belongsToOwner)
            {
                throw new UnauthorizedAccessException(
                    "No posee permisos para ver este historial.");
            }
        }
        else if (role == UserRole.Veterinarian.ToString())
        {
            var attendedPet = await _medicalRecordRepository
                .HasVeterinarianAttendedPetAsync(
                    userId,
                    petId);

            if (!attendedPet)
            {
                throw new UnauthorizedAccessException(
                    "No posee permisos para ver este historial.");
            }
        }
        else
        {
            throw new UnauthorizedAccessException(
                "No posee permisos para ver este historial.");
        }

        var medicalRecords = await _medicalRecordRepository
            .GetByPetIdAsync(petId);

        return medicalRecords
            .Select(m => new MedicalRecordResponseDto
            {
                MedicalRecordId = m.MedicalRecordId,
                AppointmentId = m.AppointmentId,
                PetId = m.PetId,
                PetName = pet.Name,
                VeterinarianId = m.VeterinarianId,
                VeterinarianName = m.Veterinarian.Name,
                Date = m.Date,
                Description = m.Description,
                Diagnosis = m.Diagnosis,
                Treatment = m.Treatment
            })
            .ToList();
    }

    public async Task<List<MedicalRecordPetDto>> GetPetsByVeterinarianAsync(
    int veterinarianId)
    {
        var pets = await _medicalRecordRepository
            .GetPetsByVeterinarianAsync(veterinarianId);

        return pets
            .Select(p => new MedicalRecordPetDto
            {
                PetId = p.PetId,
                Name = p.Name,
                Species = p.Species,
                Breed = p.Breed
            })
            .ToList();
    }

    public async Task<MedicalRecordResponseDto?> GetByAppointmentAsync(
     int appointmentId)
    {
        var medicalRecord = await _medicalRecordRepository
            .GetByAppointmentIdAsync(appointmentId);

        if (medicalRecord == null)
        {
            return null;
        }

        return new MedicalRecordResponseDto
        {
            MedicalRecordId = medicalRecord.MedicalRecordId,
            AppointmentId = medicalRecord.AppointmentId,
            PetId = medicalRecord.PetId,
            PetName = medicalRecord.Pet.Name,
            VeterinarianId = medicalRecord.VeterinarianId,
            VeterinarianName = medicalRecord.Veterinarian.Name,
            Date = medicalRecord.Date,
            Description = medicalRecord.Description,
            Diagnosis = medicalRecord.Diagnosis,
            Treatment = medicalRecord.Treatment
        };
    }
}