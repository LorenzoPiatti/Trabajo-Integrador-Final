using VetControl.Application.DTOs.Reminders;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;

namespace VetControl.Application.Services;

public class ReminderService : IReminderService
{
    private readonly IReminderRepository _reminderRepository;
    private readonly IEmailService _emailService;

    public ReminderService(
        IReminderRepository reminderRepository,
        IEmailService emailService)
    {
        _reminderRepository = reminderRepository;
        _emailService = emailService;
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

    public async Task<int> GetUnreadCountAsync(
        int userId)
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

        await _reminderRepository
            .SaveChangesAsync();
    }

    public async Task MarkAllAsReadAsync(
        int userId)
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

        await _reminderRepository
            .SaveChangesAsync();
    }

    public async Task CreateAppointmentReminderAsync(
        int ownerId,
        Appointment appointment)
    {
        var reminderDate =
            appointment.DateTime.AddHours(-2);

        // Si faltan 2 horas o menos para el turno,
        // no se genera un segundo recordatorio.
        // El dueño ya recibe el mail inmediato
        // de confirmación al reservar.
        if (reminderDate <= DateTime.Now)
        {
            return;
        }

        var reminder = new Reminder
        {
            OwnerId = ownerId,

            // Se calcula usando la fecha/hora REAL del turno.
            ReminderDate = reminderDate,

            Type = ReminderType.Appointment,
            Sent = false,
            AppointmentId = appointment.AppointmentId,
            AdministeredVaccineId = null,
            IsRead = false,

            // Este sí representa cuándo se creó el reminder.
            CreatedAt = DateTime.Now
        };

        await _reminderRepository
            .AddAsync(reminder);

        await _reminderRepository
            .SaveChangesAsync();
    }

    public async Task ProcessPendingAppointmentRemindersAsync()
    {
        var currentDateTime =
            DateTime.Now;

        var reminders =
            await _reminderRepository
                .GetPendingAppointmentRemindersAsync(
                    currentDateTime);

        if (reminders.Count == 0)
        {
            return;
        }

        foreach (var reminder in reminders)
        {
            var owner =
                reminder.Owner;

            var appointment =
                reminder.Appointment;

            if (appointment is null)
            {
                continue;
            }

            var ownerEmail =
                owner.User?.Email;

            if (string.IsNullOrWhiteSpace(
                ownerEmail))
            {
                continue;
            }

            var petName =
                appointment.Pet?.Name
                ?? "tu mascota";

            var veterinarianName =
                appointment.Veterinarian?.Name
                ?? "el veterinario";

            var subject =
                "VetControl - Recordatorio de turno";

            var body =
                $"Hola {owner.FirstName},\n\n" +
                $"Te recordamos que {petName} tiene un turno dentro de 2 horas.\n\n" +
                $"Fecha: {appointment.DateTime:dd/MM/yyyy}\n" +
                $"Hora: {appointment.DateTime:HH:mm}\n" +
                $"Veterinario: {veterinarianName}\n" +
                $"Motivo: {appointment.Reason}\n\n" +
                "Te esperamos.\n\n" +
                "VetControl";

            await _emailService.SendEmailAsync(
                ownerEmail,
                subject,
                body);

            reminder.Sent = true;
        }

        await _reminderRepository
            .SaveChangesAsync();
    }

    public async Task ProcessPendingVaccineRemindersAsync()
    {
        var currentDateTime =
            DateTime.Now;

        var reminders =
            await _reminderRepository
                .GetPendingVaccineRemindersAsync(
                    currentDateTime);

        if (reminders.Count == 0)
        {
            return;
        }

        foreach (var reminder in reminders)
        {
            var owner =
                reminder.Owner;

            var administeredVaccine =
                reminder.AdministeredVaccine;

            if (administeredVaccine is null)
            {
                continue;
            }

            var ownerEmail =
                owner.User?.Email;

            if (string.IsNullOrWhiteSpace(
                ownerEmail))
            {
                continue;
            }

            var petName =
                administeredVaccine.Pet?.Name
                ?? "tu mascota";

            var vaccineName =
                administeredVaccine.Vaccine?.Name
                ?? "la vacuna correspondiente";

            var subject =
                "VetControl - Recordatorio de vacunación";

            var body =
                $"Hola {owner.FirstName},\n\n" +
                $"Te recordamos que a {petName} le corresponde una nueva aplicación de vacuna.\n\n" +
                $"Vacuna: {vaccineName}\n" +
                $"Fecha correspondiente: {administeredVaccine.NextDueDate:dd/MM/yyyy}\n\n" +
                "Te recomendamos comunicarte con la veterinaria para coordinar la próxima aplicación.\n\n" +
                "VetControl";

            await _emailService.SendEmailAsync(
                ownerEmail,
                subject,
                body);

            reminder.Sent = true;
        }

        await _reminderRepository
            .SaveChangesAsync();
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
            ReminderId =
                reminder.ReminderId,

            ReminderDate =
                reminder.ReminderDate,

            Type =
                reminder.Type.ToString(),

            Title =
                title,

            Message =
                message,

            IsRead =
                reminder.IsRead,

            CreatedAt =
                reminder.CreatedAt,

            AppointmentId =
                reminder.AppointmentId,

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

        var appointmentDate =
            reminder.Appointment?.DateTime
            ?? reminder.ReminderDate;

        return
            $"Recordá que {petName} tiene un turno " +
            $"el {appointmentDate:dd/MM/yyyy} " +
            $"a las {appointmentDate:HH:mm}.";
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

        var dueDate =
            reminder.AdministeredVaccine?.NextDueDate
            ?? reminder.ReminderDate;

        return
            $"A {petName} le corresponde {vaccineName} " +
            $"el {dueDate:dd/MM/yyyy}.";
    }
}