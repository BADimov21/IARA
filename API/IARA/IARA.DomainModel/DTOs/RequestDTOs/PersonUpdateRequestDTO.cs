using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for updating person information
/// </summary>
public class PersonUpdateRequestDTO
{
    [Required]
    public int Id { get; set; }

    [MaxLength(50)]
    public string? FirstName { get; set; }

    [MaxLength(50)]
    public string? MiddleName { get; set; }

    [MaxLength(50)]
    public string? LastName { get; set; }

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
