using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VetControl.Application.Interfaces;

namespace VetControl.API.Controllers;


[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;


    public UsersController(IUserService userService)
    {
        _userService = userService;
    }


    [HttpGet("veterinarians")]
    [Authorize]
    public async Task<IActionResult> GetVeterinarians()
    {
        var veterinarians =
            await _userService.GetVeterinariansAsync();


        var result = veterinarians.Select(v => new
        {
            id = v.UserId,
            name = v.Name,
            email = v.Email
        });


        return Ok(result);
    }
}