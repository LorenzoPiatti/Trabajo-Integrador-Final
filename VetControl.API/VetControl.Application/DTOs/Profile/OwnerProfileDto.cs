namespace VetControl.Application.DTOs.Profile;

public class OwnerProfileDto
{
    public int OwnerId { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;
}