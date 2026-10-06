using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VetControl.Application.DTOs.Vaccines;
using VetControl.Application.Interfaces;

namespace VetControl.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VaccinesController : ControllerBase
{
    private readonly IVaccineService _vaccineService;

    public VaccinesController(
        IVaccineService vaccineService)
    {
        _vaccineService = vaccineService;
    }

    [HttpGet]
    public async Task<IActionResult> GetVaccines()
    {
        try
        {
            var vaccines =
                await _vaccineService.GetVaccinesAsync();

            return Ok(vaccines);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateVaccine(
        CreateVaccineRequestDto dto)
    {
        try
        {
            var vaccine =
                await _vaccineService.CreateVaccineAsync(
                    dto);

            return Ok(vaccine);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateVaccine(
        int id,
        UpdateVaccineRequestDto dto)
    {
        try
        {
            await _vaccineService.UpdateVaccineAsync(
                id,
                dto);

            return Ok(new
            {
                message = "Vacuna actualizada correctamente."
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteVaccine(
        int id)
    {
        try
        {
            await _vaccineService.DeleteVaccineAsync(
                id);

            return Ok(new
            {
                message = "Vacuna eliminada correctamente."
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpGet("my")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetMyVaccines()
    {
        try
        {
            var userId = GetCurrentUserId();

            var vaccines =
                await _vaccineService.GetMyVaccinesAsync(
                    userId);

            return Ok(vaccines);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpGet("my/{id:int}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetById(
        int id)
    {
        try
        {
            var userId = GetCurrentUserId();

            var vaccine =
                await _vaccineService.GetByIdAsync(
                    id,
                    userId);

            if (vaccine is null)
            {
                return NotFound(new
                {
                    message = "Vacuna aplicada no encontrada."
                });
            }

            return Ok(vaccine);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    private int GetCurrentUserId()
    {
        return int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);
    }
}
