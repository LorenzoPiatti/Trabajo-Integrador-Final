using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VetControl.Application.DTOs.Pets;
using VetControl.Application.Interfaces;

namespace VetControl.API.Controllers;

[ApiController]
[Authorize(Roles = "Owner")]
[Route("api/[controller]")]
public class PetsController : ControllerBase
{
    private readonly IPetService _petService;

    public PetsController(IPetService petService)
    {
        _petService = petService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyPets()
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized("Usuario no autenticado.");
        }

        try
        {
            var pets = await _petService
                .GetMyPetsAsync(userId.Value);

            return Ok(pets);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{petId:int}")]
    public async Task<IActionResult> GetMyPet(int petId)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized("Usuario no autenticado.");
        }

        try
        {
            var pet = await _petService
                .GetMyPetByIdAsync(userId.Value, petId);

            return Ok(pet);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreatePetRequestDto request)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized("Usuario no autenticado.");
        }

        try
        {
            var pet = await _petService
                .CreateAsync(userId.Value, request);

            return CreatedAtAction(
                nameof(GetMyPet),
                new { petId = pet.PetId },
                pet);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{petId:int}")]
    public async Task<IActionResult> Update(
        int petId,
        UpdatePetRequestDto request)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized("Usuario no autenticado.");
        }

        try
        {
            var pet = await _petService
                .UpdateAsync(userId.Value, petId, request);

            return Ok(pet);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{petId:int}")]
    public async Task<IActionResult> Delete(int petId)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized("Usuario no autenticado.");
        }

        try
        {
            await _petService
                .DeleteAsync(userId.Value, petId);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    private int? GetCurrentUserId()
    {
        var userId = User.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        return int.TryParse(userId, out var parsedUserId)
            ? parsedUserId
            : null;
    }
}
