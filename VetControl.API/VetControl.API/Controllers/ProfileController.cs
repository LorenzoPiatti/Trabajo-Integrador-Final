using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VetControl.Application.DTOs.Profile;
using VetControl.Application.Interfaces;

namespace VetControl.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    // GET: api/Profile
    // Devuelve el perfil del usuario autenticado.
    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                message = "Usuario no autenticado."
            });
        }

        try
        {
            var profile = await _profileService
                .GetProfileAsync(userId.Value);

            return Ok(profile);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }

    // PUT: api/Profile
    // Actualiza los datos permitidos del usuario autenticado.
    [HttpPut]
    public async Task<IActionResult> UpdateProfile(
        [FromBody] UpdateProfileRequestDto request)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                message = "Usuario no autenticado."
            });
        }

        try
        {
            var updatedProfile = await _profileService
                .UpdateProfileAsync(userId.Value, request);

            return Ok(new
            {
                message = "Perfil actualizado correctamente.",
                profile = updatedProfile
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }

    // Obtiene el identificador del usuario desde el JWT.
    private int? GetCurrentUserId()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        return int.TryParse(userId, out var parsedUserId)
            ? parsedUserId
            : null;
    }
}