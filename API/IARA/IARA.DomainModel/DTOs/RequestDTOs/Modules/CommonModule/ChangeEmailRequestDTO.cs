using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.CommonModule;

/// <summary>
/// Request DTO for changing user email
/// </summary>
public class ChangeEmailRequestDTO
{
    [Required(ErrorMessage = "User ID is required")]
    public string UserId { get; set; } = null!;
    
    [Required(ErrorMessage = "New email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string NewEmail { get; set; } = null!;
}
