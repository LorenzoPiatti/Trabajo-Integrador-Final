using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IOwnerRepository
{
    Task<Owner?> GetByUserIdAsync(int userId);
}