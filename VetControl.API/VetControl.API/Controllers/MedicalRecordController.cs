using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VetControl.Application.DTOs.MedicalRecords;
using VetControl.Application.Interfaces;

namespace VetControl.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MedicalRecordController : ControllerBase
{
    private readonly IMedicalRecordService _medicalRecordService;

    public MedicalRecordController(
        IMedicalRecordService medicalRecordService)
    {
        _medicalRecordService = medicalRecordService;
    }

    [HttpPost]
    [Authorize(Roles = "Veterinarian")]
    public async Task<IActionResult> Register(
        CreateMedicalRecordDto dto)
    {
        var veterinarianId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _medicalRecordService.RegisterAsync(
            veterinarianId,
            dto);

        return Ok(result);
    }

    [HttpGet("pet/{petId}")]
    [Authorize(Roles = "Owner,Veterinarian")]
    public async Task<IActionResult> GetPetHistory(
        int petId)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var role = User.FindFirstValue(ClaimTypes.Role)!;

        var result = await _medicalRecordService.GetPetHistoryAsync(
            petId,
            userId,
            role);

        return Ok(result);
    }

    [HttpGet("pets")]
    [Authorize(Roles = "Veterinarian")]
    public async Task<IActionResult> GetVeterinarianPets()
    {
        try
        {
            var veterinarianId = int.Parse(
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier)!);

            var pets = await _medicalRecordService
                .GetPetsByVeterinarianAsync(
                    veterinarianId);

            return Ok(pets);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpGet("appointment/{appointmentId}")]
    [Authorize(Roles = "Veterinarian")]
    public async Task<IActionResult> GetByAppointment(
        int appointmentId)
    {
        var result = await _medicalRecordService.GetByAppointmentAsync(
            appointmentId);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}