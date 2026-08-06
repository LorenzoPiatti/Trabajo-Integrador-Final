using VetControl.Application.DTOs.Reminders;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;

namespace VetControl.Application.Services;

public class ReminderService : IReminderService
{
    private readonly IReminderRepository _reminderRepository;

    public ReminderService(
        IReminderRepository reminderRepository)
    {
        _reminderRepository = reminderRepository;
    }

    public async Task<List<ReminderResponseDto>>
        GetMyRemindersAsync(
            int userId,
            bool unreadOnly = false)
    {
        var reminders = unreadOnly
            ? await _reminderRepository
                .GetUnreadByOwnerUserIdAsync(userId)
            : await _reminderRepository
                .GetByOwnerUserIdAsync(userId);

        return reminders
            .Select(MapToResponseDto)
            .ToList();
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _reminderRepository
            .GetUnreadCountAsync(userId);
    }

    public async Task MarkAsReadAsync(
        int reminderId,
        int userId)
    {
        var reminder = await _reminderRepository
            .GetByIdForOwnerUserIdAsync(
                reminderId,
                userId);

        if (reminder is null)
        {
            throw new KeyNotFoundException(
                "Notificación no encontrada.");
        }

        if (reminder.IsRead)
        {
            return;
        }

        reminder.IsRead = true;

        await _reminderRepository.SaveChangesAsync();
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        var reminders = await _reminderRepository
            .GetUnreadByOwnerUserIdAsync(userId);

        if (reminders.Count == 0)
        {
            return;
        }

        foreach (var reminder in reminders)
        {
            reminder.IsRead = true;
        }

        await _reminderRepository.SaveChangesAsync();
    }

    private static ReminderResponseDto MapToResponseDto(
        Reminder reminder)
    {
        var title = reminder.Type switch
        {
            ReminderType.Appointment =>
                "Recordatorio de turno",

            ReminderType.Vaccine =>
                "Recordatorio de vacunación",

            _ => "Recordatorio"
        };

        var message = reminder.Type switch
        {
            ReminderType.Appointment =>
                BuildAppointmentMessage(reminder),

            ReminderType.Vaccine =>
                BuildVaccineMessage(reminder),

            _ => "Tenés un nuevo recordatorio."
        };

        return new ReminderResponseDto
        {
            ReminderId = reminder.ReminderId,
            ReminderDate = reminder.ReminderDate,
            Type = reminder.Type.ToString(),
            Title = title,
            Message = message,
            IsRead = reminder.IsRead,
            CreatedAt = reminder.CreatedAt,
            AppointmentId = reminder.AppointmentId,
            AdministeredVaccineId =
                reminder.AdministeredVaccineId
        };
    }

    private static string BuildAppointmentMessage(
        Reminder reminder)
    {
        var petName =
            reminder.Appointment?.Pet?.Name
            ?? "tu mascota";

        return $"Recordá que {petName} tiene un turno " +
               $"el {reminder.ReminderDate:dd/MM/yyyy} " +
               $"a las {reminder.ReminderDate:HH:mm}.";
    }

    private static string BuildVaccineMessage(
        Reminder reminder)
    {
        var petName =
            reminder.AdministeredVaccine?.Pet?.Name
            ?? "tu mascota";

        var vaccineName =
            reminder.AdministeredVaccine?.Vaccine?.Name
            ?? "una vacuna";

        return $"A {petName} le corresponde {vaccineName} " +
               $"el {reminder.ReminderDate:dd/MM/yyyy}.";
    }
}