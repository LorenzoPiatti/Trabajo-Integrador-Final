using VetControl.Domain.Entities;

namespace VetControl.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}