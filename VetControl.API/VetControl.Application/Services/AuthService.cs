using VetControl.Application.DTOs.Auth;
using VetControl.Application.Interfaces;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;

namespace VetControl.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public AuthService(
        IUserRepository userRepository,
        IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task RegisterAsync(RegisterRequestDto request)
    {
        var existingUser = await _userRepository
            .GetByEmailAsync(request.Email);

        if (existingUser != null)
        {
            throw new Exception("El email ya se encuentra registrado.");
        }

        var user = new User
        {
            Email = request.Email,
            Password = request.Password,
            Role = UserRole.Owner,
            Active = true,
            EmailVerified = false,
            VerificationCode = Guid.NewGuid()
                .ToString()
                .Substring(0, 6)
                .ToUpper()
        };

        await _userRepository.AddAsync(user);

        await _userRepository.SaveChangesAsync();
    }

    public async Task VerifyEmailAsync(
        VerifyEmailRequestDto request)
    {
        var user = await _userRepository
            .GetByEmailAsync(request.Email);

        if (user == null)
        {
            throw new Exception("Usuario no encontrado.");
        }

        if (user.VerificationCode != request.VerificationCode)
        {
            throw new Exception("Código inválido.");
        }

        user.EmailVerified = true;
        user.VerificationCode = null;

        await _userRepository.UpdateAsync(user);

        await _userRepository.SaveChangesAsync();
    }

    public async Task<string> LoginAsync(
        LoginRequestDto request)
    {
        var user = await _userRepository
            .GetByEmailAsync(request.Email);

        if (user == null)
        {
            throw new Exception("Usuario no encontrado.");
        }

        if (user.Password != request.Password)
        {
            throw new Exception("Contraseña incorrecta.");
        }

        if (!user.EmailVerified)
        {
            throw new Exception(
                "Debe verificar su email antes de iniciar sesión.");
        }

        return _jwtService.GenerateToken(user);
    }

    public async Task ForgotPasswordAsync(
        ForgotPasswordRequestDto request)
    {
        var user = await _userRepository
            .GetByEmailAsync(request.Email);

        if (user == null)
        {
            throw new Exception(
                "Usuario no encontrado.");
        }

        user.VerificationCode = Guid.NewGuid()
            .ToString()
            .Substring(0, 6)
            .ToUpper();

        await _userRepository.UpdateAsync(user);

        await _userRepository.SaveChangesAsync();
    }

    public async Task ResetPasswordAsync(
        ResetPasswordRequestDto request)
    {
        var user = await _userRepository
            .GetByEmailAsync(request.Email);

        if (user == null)
        {
            throw new Exception(
                "Usuario no encontrado.");
        }

        if (user.VerificationCode != request.VerificationCode)
        {
            throw new Exception(
                "Código inválido.");
        }

        user.Password = request.NewPassword;
        user.VerificationCode = null;

        await _userRepository.UpdateAsync(user);

        await _userRepository.SaveChangesAsync();
    }
}