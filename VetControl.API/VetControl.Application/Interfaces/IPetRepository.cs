using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IPetRepository
{
    Task<Pet?> GetByIdAsync(int petId);

    Task<bool> BelongsToOwnerAsync(
        int petId,
        int ownerId);
}