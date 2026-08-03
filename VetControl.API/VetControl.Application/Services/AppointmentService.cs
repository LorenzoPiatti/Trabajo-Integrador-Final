using VetControl.Application.DTOs.Appointments;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;

namespace VetControl.Application.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IPetRepository _petRepository;
    private readonly IUserRepository _userRepository;
    private readonly IOwnerRepository _ownerRepository;

    public AppointmentService(
        IAppointmentRepository appointmentRepository,
        IPetRepository petRepository,
        IUserRepository userRepository,
        IOwnerRepository ownerRepository)
    {
        _appointmentRepository = appointmentRepository;
        _petRepository = petRepository;
        _userRepository = userRepository;
        _ownerRepository = ownerRepository;
    }

    public async Task<AppointmentResponseDto> CreateAsync(
        int userId,
        CreateAppointmentDto dto)
    {
        var owner =
            await _ownerRepository
                .GetByUserIdAsync(userId);

        if (owner is null)
        {
            throw new Exception(
                "El propietario no existe.");
        }

        var pet =
            await _petRepository
                .GetByIdAsync(dto.PetId);

        if (pet is null)
        {
            throw new Exception(
                "La mascota no existe.");
        }

        var belongsToOwner =
            await _petRepository
                .BelongsToOwnerAsync(
                    dto.PetId,
                    owner.OwnerId);

        if (!belongsToOwner)
        {
            throw new Exception(
                "La mascota no pertenece al propietario.");
        }

        var veterinarian =
            await _userRepository
                .GetByIdAsync(dto.VeterinarianId);

        if (veterinarian is null)
        {
            throw new Exception(
                "El veterinario no existe.");
        }

        if (veterinarian.Role != UserRole.Veterinarian)
        {
            throw new Exception(
                "El usuario seleccionado no es un veterinario.");
        }

        if (!IsWithinBusinessHours(dto.DateTime))
        {
            throw new Exception(
                "El horario seleccionado está fuera del horario de atención.");
        }

        var appointments =
            await _appointmentRepository
                .GetByVeterinarianAndDateAsync(
                    dto.VeterinarianId,
                    dto.DateTime.Date);

        var isOccupied = appointments.Any(a =>
            a.DateTime == dto.DateTime &&
            a.Status != AppointmentStatus.Cancelled);

        if (isOccupied)
        {
            throw new Exception(
                "El horario seleccionado no está disponible.");
        }

        var appointment = new Appointment
        {
            PetId = dto.PetId,
            VeterinarianId = dto.VeterinarianId,
            DateTime = dto.DateTime,
            Reason = dto.Reason,
            Status = AppointmentStatus.Confirmed
        };

        await _appointmentRepository.AddAsync(
            appointment);

        await _appointmentRepository.SaveChangesAsync();

        return MapToResponseDto(
            appointment,
            pet,
            veterinarian);
    }

    public async Task<List<AppointmentAvailabilityDto>> GetAvailabilityAsync(
        int veterinarianId,
        DateTime date)
    {
        var veterinarian = await _userRepository.GetByIdAsync(
            veterinarianId);

        if (veterinarian is null)
        {
            throw new Exception("El veterinario no existe.");
        }

        if (veterinarian.Role != UserRole.Veterinarian)
        {
            throw new Exception(
                "El usuario seleccionado no es un veterinario.");
        }

        var appointments =
            await _appointmentRepository.GetByVeterinarianAndDateAsync(
                veterinarianId,
                date.Date);

        var availability = new List<AppointmentAvailabilityDto>();

        AddTimeSlots(
            availability,
            appointments,
            date.Date.AddHours(8),
            date.Date.AddHours(12));

        AddTimeSlots(
            availability,
            appointments,
            date.Date.AddHours(16),
            date.Date.AddHours(20));

        return availability;
    }

    public async Task<List<AppointmentResponseDto>> GetByOwnerAsync(
        int userId)
    {
        var owner =
            await _ownerRepository.GetByUserIdAsync(userId);

        if (owner is null)
        {
            throw new Exception(
                "El propietario no existe.");
        }

        var appointments =
            await _appointmentRepository
                .GetByOwnerAsync(owner.OwnerId);

        return appointments
            .Select(a => MapToResponseDto(
                a,
                a.Pet,
                a.Veterinarian))
            .ToList();
    }

    public async Task<AppointmentResponseDto?> GetByIdAsync(
        int appointmentId,
        int userId)
    {
        var owner =
            await _ownerRepository.GetByUserIdAsync(userId);

        if (owner is null)
        {
            throw new Exception(
                "El propietario no existe.");
        }

        var appointment =
            await _appointmentRepository
                .GetByIdAsync(appointmentId);

        if (appointment is null)
        {
            return null;
        }

        if (appointment.Pet.OwnerId != owner.OwnerId)
        {
            throw new Exception(
                "No puede acceder a un turno que no le pertenece.");
        }

        return MapToResponseDto(
            appointment,
            appointment.Pet,
            appointment.Veterinarian);
    }

    public async Task UpdateAsync(
        int appointmentId,
        int userId,
        UpdateAppointmentDto dto)
    {
        var owner =
            await _ownerRepository.GetByUserIdAsync(userId);

        if (owner is null)
        {
            throw new Exception(
                "El propietario no existe.");
        }

        var appointment =
            await _appointmentRepository
                .GetByIdAsync(appointmentId);

        if (appointment is null)
        {
            throw new Exception(
                "El turno no existe.");
        }

        if (appointment.Pet.OwnerId != owner.OwnerId)
        {
            throw new Exception(
                "No puede modificar un turno que no le pertenece.");
        }

        var pet =
            await _petRepository
                .GetByIdAsync(dto.PetId);

        if (pet is null)
        {
            throw new Exception(
                "La mascota no existe.");
        }

        if (pet.OwnerId != owner.OwnerId)
        {
            throw new Exception(
                "La mascota no pertenece al propietario.");
        }

        var veterinarian =
            await _userRepository
                .GetByIdAsync(dto.VeterinarianId);

        if (veterinarian is null)
        {
            throw new Exception(
                "El veterinario no existe.");
        }

        if (veterinarian.Role != UserRole.Veterinarian)
        {
            throw new Exception(
                "El usuario seleccionado no es un veterinario.");
        }

        if (!IsWithinBusinessHours(dto.DateTime))
        {
            throw new Exception(
                "El horario seleccionado está fuera del horario de atención.");
        }

        var appointments =
            await _appointmentRepository
                .GetByVeterinarianAndDateAsync(
                    dto.VeterinarianId,
                    dto.DateTime.Date);

        var isOccupied = appointments.Any(a =>
            a.AppointmentId != appointmentId &&
            a.DateTime == dto.DateTime &&
            a.Status != AppointmentStatus.Cancelled);

        if (isOccupied)
        {
            throw new Exception(
                "El horario seleccionado no está disponible.");
        }

        appointment.PetId = dto.PetId;
        appointment.VeterinarianId = dto.VeterinarianId;
        appointment.DateTime = dto.DateTime;
        appointment.Reason = dto.Reason;

        await _appointmentRepository.UpdateAsync(
            appointment);

        await _appointmentRepository.SaveChangesAsync();
    }
    public async Task CancelAsync(
        int appointmentId,
        int userId)
    {
        var owner =
            await _ownerRepository.GetByUserIdAsync(userId);

        if (owner is null)
        {
            throw new Exception(
                "El propietario no existe.");
        }

        var appointment =
            await _appointmentRepository
                .GetByIdAsync(appointmentId);

        if (appointment is null)
        {
            throw new Exception(
                "El turno no existe.");
        }

        if (appointment.Pet.OwnerId != owner.OwnerId)
        {
            throw new Exception(
                "No puede cancelar un turno que no le pertenece.");
        }

        if (appointment.Status ==
            AppointmentStatus.Cancelled)
        {
            throw new Exception(
                "El turno ya está cancelado.");
        }

        appointment.Status =
            AppointmentStatus.Cancelled;

        await _appointmentRepository.UpdateAsync(
            appointment);

        await _appointmentRepository.SaveChangesAsync();
    }

    private static bool IsWithinBusinessHours(
        DateTime dateTime)
    {
        var time = dateTime.TimeOfDay;

        var morningStart =
            new TimeSpan(8, 0, 0);

        var morningEnd =
            new TimeSpan(12, 0, 0);

        var afternoonStart =
            new TimeSpan(16, 0, 0);

        var afternoonEnd =
            new TimeSpan(20, 0, 0);

        return
            (time >= morningStart &&
             time < morningEnd)
            ||
            (time >= afternoonStart &&
             time < afternoonEnd);
    }

    private static void AddTimeSlots(
        List<AppointmentAvailabilityDto> availability,
        List<Appointment> appointments,
        DateTime start,
        DateTime end)
    {
        var current = start;

        while (current < end)
        {
            var isOccupied = appointments.Any(a =>
                a.DateTime == current &&
                a.Status != AppointmentStatus.Cancelled);

            availability.Add(
                new AppointmentAvailabilityDto
                {
                    DateTime = current,
                    Available = !isOccupied
                });

            current = current.AddMinutes(30);
        }
    }

    private static AppointmentResponseDto MapToResponseDto(
        Appointment appointment,
        Pet pet,
        User veterinarian)
    {
        return new AppointmentResponseDto
        {
            AppointmentId = appointment.AppointmentId,
            PetId = appointment.PetId,
            PetName = pet.Name,
            VeterinarianId = appointment.VeterinarianId,
            VeterinarianName = veterinarian.Name,
            DateTime = appointment.DateTime,
            Reason = appointment.Reason,
            Status = appointment.Status.ToString()
        };
    }
}