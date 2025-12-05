using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.CommonModule;

/// <summary>
/// Request DTO for updating user information
/// </summary>
public class UserUpdateRequestDTO
{
    [Required]
    public int UserId { get; set; }

    [MaxLength(255)]
    [EmailAddress]
    public string? Email { get; set; }

    public bool? IsActive { get; set; }

    public int? PersonId { get; set; }
}



