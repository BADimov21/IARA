using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for user creation (alias for UserRegisterRequestDTO)
/// </summary>
public class UserCreateRequestDTO
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
    [MaxLength(100)]
    public string Password { get; set; } = null!;

    [MaxLength(50)]
    public string UserType { get; set; } = "User";
}
