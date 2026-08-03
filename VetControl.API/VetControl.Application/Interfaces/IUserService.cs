using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IUserService
{
    Task<IEnumerable<User>> GetVeterinariansAsync();
}