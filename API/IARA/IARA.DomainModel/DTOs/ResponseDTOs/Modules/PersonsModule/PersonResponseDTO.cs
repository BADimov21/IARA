namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;

/// <summary>
/// Response DTO for person information
/// </summary>
public class PersonResponseDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = null!;
    public string FullName => $"{FirstName} {MiddleName} {LastName}".Replace("  ", " ").Trim();
    public string? EGN { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
}


