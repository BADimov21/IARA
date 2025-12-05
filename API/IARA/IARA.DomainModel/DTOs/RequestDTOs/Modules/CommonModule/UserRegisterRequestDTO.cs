using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.CommonModule;

/// <summary>
/// Request DTO for user registration
/// </summary>
public class UserRegisterRequestDTO
{
    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    public string UserType { get; set; } = null!;

    public int? PersonId { get; set; }
}



