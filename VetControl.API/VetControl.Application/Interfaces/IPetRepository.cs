using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IPetRepository
{
    Task<List<Pet>> GetByOwnerUserIdAsync(int userId);

    Task<Pet?> GetByIdForOwnerUserIdAsync(
        int petId,
        int userId);

    Task<int?> GetOwnerIdByUserIdAsync(int userId);

    Task<Pet?> GetByIdAsync(int petId);

    Task<bool> BelongsToOwnerAsync(
        int petId,
        int ownerId);

    Task AddAsync(Pet pet);

    Task UpdateAsync(Pet pet);

    Task DeleteAsync(Pet pet);

    Task SaveChangesAsync();
}