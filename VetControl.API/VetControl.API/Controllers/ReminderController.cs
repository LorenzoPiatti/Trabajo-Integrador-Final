using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VetControl.Application.Interfaces;

namespace VetControl.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Owner")]
public class ReminderController : ControllerBase
{
    private readonly IReminderService _reminderService;

    public ReminderController(IReminderService reminderService)
    {
        _reminderService = reminderService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyReminders(
        [FromQuery] bool unreadOnly = false)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                message = "Usuario no autenticado."
            });
        }

        var reminders = await _reminderService
            .GetMyRemindersAsync(userId.Value, unreadOnly);

        return Ok(reminders);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                message = "Usuario no autenticado."
            });
        }

        var count = await _reminderService
            .GetUnreadCountAsync(userId.Value);

        return Ok(new
        {
            unreadCount = count
        });
    }

    [HttpPatch("{reminderId:int}/read")]
    public async Task<IActionResult> MarkAsRead(int reminderId)
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
            await _reminderService.MarkAsReadAsync(
                reminderId,
                userId.Value);

            return Ok(new
            {
                message = "Notificación marcada como leída."
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

    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                message = "Usuario no autenticado."
            });
        }

        await _reminderService
            .MarkAllAsReadAsync(userId.Value);

        return Ok(new
        {
            message = "Todas las notificaciones fueron marcadas como leídas."
        });
    }

    private int? GetCurrentUserId()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        return int.TryParse(userId, out var parsedUserId)
            ? parsedUserId
            : null;
    }
}