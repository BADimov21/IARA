using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for creating a fishing gear type
/// </summary>
public class FishingGearTypeCreateRequestDTO
{
    [Required]
    [MaxLength(100)]
    public string TypeName { get; set; } = null!;
}
