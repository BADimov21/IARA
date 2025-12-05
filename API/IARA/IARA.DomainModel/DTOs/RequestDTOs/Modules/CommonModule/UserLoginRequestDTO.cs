using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.CommonModule;

/// <summary>
/// Request DTO for user login
/// </summary>
public class UserLoginRequestDTO
{
    [Required]
    public string Username { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;
}



