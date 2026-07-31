using VetControl.Application.DTOs.Auth;

namespace VetControl.Application.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(RegisterRequestDto request);

    Task VerifyEmailAsync(
        VerifyEmailRequestDto request);

    Task<string> LoginAsync(
        LoginRequestDto request);

    Task ForgotPasswordAsync(
        ForgotPasswordRequestDto request);

    Task ResetPasswordAsync(
        ResetPasswordRequestDto request);
}
