using Microsoft.AspNetCore.Mvc;
using VetControl.Application.DTOs.Auth;
using VetControl.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace VetControl.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequestDto request)
    {
        try
        {
            await _authService.RegisterAsync(request);

            return Ok(new
            {
                message = "Usuario registrado correctamente."
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(
        VerifyEmailRequestDto request)
    {
        try
        {
            await _authService.VerifyEmailAsync(request);

            return Ok(new
            {
                message = "Email verificado correctamente."
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        try
        {
            var token = await _authService.LoginAsync(request);

            return Ok(new
            {
                token
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
        ForgotPasswordRequestDto request)
    {
        try
        {
            await _authService.ForgotPasswordAsync(request);

            return Ok(new
            {
                message = "Código de recuperación generado correctamente."
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        ResetPasswordRequestDto request)
    {
        try
        {
            await _authService.ResetPasswordAsync(request);

            return Ok(new
            {
                message = "Contraseña actualizada correctamente."
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        var email = User.FindFirst(
            ClaimTypes.Email)?.Value;

        var role = User.FindFirst(
            ClaimTypes.Role)?.Value;

        return Ok(new
        {
            UserId = userId,
            Email = email,
            Role = role
        });
    }
}