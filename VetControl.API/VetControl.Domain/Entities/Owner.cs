namespace VetControl.Domain.Entities;

public class Owner
{
    public int OwnerId { get; set; }

    public int UserId { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public User User { get; set; } = null!;

    public ICollection<Pet> Pets { get; set; }
        = new List<Pet>();

    public ICollection<Reminder> Reminders { get; set; }
        = new List<Reminder>();
}