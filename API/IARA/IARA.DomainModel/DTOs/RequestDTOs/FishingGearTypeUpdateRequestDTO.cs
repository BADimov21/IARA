using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for updating a fishing gear type
/// </summary>
public class FishingGearTypeUpdateRequestDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string TypeName { get; set; } = null!;
}
