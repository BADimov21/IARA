using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.PersonsModule;

/// <summary>
/// Request DTO for creating a new person
/// </summary>
public class PersonCreateRequestDTO
{
    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; } = null!;

    [MaxLength(50)]
    public string? MiddleName { get; set; }

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = null!;

    [MaxLength(10)]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "EGN must be exactly 10 digits")]
    public string? EGN { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    [MaxLength(200)]
    public string? Address { get; set; }

    [MaxLength(20)]
    [Phone]
    public string? PhoneNumber { get; set; }
}



