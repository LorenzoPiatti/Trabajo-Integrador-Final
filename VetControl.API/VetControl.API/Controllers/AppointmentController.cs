using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VetControl.Application.DTOs.Appointments;
using VetControl.Application.Interfaces;

namespace VetControl.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentController(
        IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }


    [HttpPost]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> Create(
        CreateAppointmentDto dto)
    {
        try
        {
            var userId = int.Parse(
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier)!);

            var appointment =
                await _appointmentService.CreateAsync(
                    userId,
                    dto);

            return Ok(appointment);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }


    [HttpGet("availability")]
    [Authorize]
    public async Task<IActionResult> GetAvailability(
        int veterinarianId,
        DateTime date)
    {
        try
        {
            var availability =
                await _appointmentService.GetAvailabilityAsync(
                    veterinarianId,
                    date);

            return Ok(availability);
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
    public async Task<IActionResult> GetMyAppointments()
    {
        try
        {
            var userId = int.Parse(
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier)!);

            var appointments =
                await _appointmentService.GetByOwnerAsync(
                    userId);

            return Ok(appointments);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }


    [HttpGet("{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetById(
        int id)
    {
        try
        {
            var userId = int.Parse(
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier)!);

            var appointment =
                await _appointmentService.GetByIdAsync(
                    id,
                    userId);

            if (appointment is null)
            {
                return NotFound(new
                {
                    message = "Turno no encontrado."
                });
            }

            return Ok(appointment);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }


    [HttpPut("{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> Update(
        int id,
        UpdateAppointmentDto dto)
    {
        try
        {
            var userId = int.Parse(
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier)!);

            await _appointmentService.UpdateAsync(
                id,
                userId,
                dto);

            return Ok(new
            {
                message = "Turno actualizado correctamente."
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


    [HttpDelete("{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> Cancel(
        int id)
    {
        try
        {
            var userId = int.Parse(
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier)!);

            await _appointmentService.CancelAsync(
                id,
                userId);

            return Ok(new
            {
                message = "Turno cancelado correctamente."
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
}