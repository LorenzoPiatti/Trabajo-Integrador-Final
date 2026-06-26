using VetControl.Application.DTOs.Auth;

namespace VetControl.Application.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(RegisterRequestDto request);

    Task VerifyEmailAsync(
        VerifyEmailRequestDto request);

    Task<string> LoginAsync(
        LoginRequestDto request);
    public Task ForgotPasswordAsync(
    ForgotPasswordRequestDto request)
    {
        throw new NotImplementedException();
    }

    public Task ResetPasswordAsync(
        ResetPasswordRequestDto request)
    {
        throw new NotImplementedException();
    }
}