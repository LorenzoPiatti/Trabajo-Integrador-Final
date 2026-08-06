using VetControl.Application.DTOs.Reminders;

namespace VetControl.Application.Interfaces;

public interface IReminderService
{
    Task<List<ReminderResponseDto>> GetMyRemindersAsync(
        int userId,
        bool unreadOnly = false);

    Task<int> GetUnreadCountAsync(int userId);

    Task MarkAsReadAsync(
        int reminderId,
        int userId);

    Task MarkAllAsReadAsync(int userId);
}