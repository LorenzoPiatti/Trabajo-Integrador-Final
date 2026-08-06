using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IReminderRepository
{
    Task<List<Reminder>> GetByOwnerUserIdAsync(int userId);

    Task<Reminder?> GetByIdForOwnerUserIdAsync(
        int reminderId,
        int userId);

    Task<List<Reminder>> GetUnreadByOwnerUserIdAsync(
        int userId);

    Task<int> GetUnreadCountAsync(int userId);

    Task AddAsync(Reminder reminder);

    Task SaveChangesAsync();
}