using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.PersonsModule;

/// <summary>
/// Request DTO for user self-registration of personal information
/// Links the authenticated user to their personal information
/// </summary>
public class UserPersonInfoRequestDTO
{
    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; } = null!;

    [MaxLength(50)]
    public string? MiddleName { get; set; }

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = null!;

    [Required]
    [MaxLength(10)]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "EGN must be exactly 10 digits")]
    public string EGN { get; set; } = null!;

    [Required]
    public DateOnly DateOfBirth { get; set; }

    [Required]
    [MaxLength(200)]
    public string Address { get; set; } = null!;

    [Required]
    [MaxLength(20)]
    [Phone]
    public string PhoneNumber { get; set; } = null!;
}
