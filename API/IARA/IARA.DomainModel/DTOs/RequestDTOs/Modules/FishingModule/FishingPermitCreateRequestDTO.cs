using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;

/// <summary>
/// Request DTO for creating a fishing permit
/// </summary>
public class FishingPermitCreateRequestDTO
{
    [Required]
    [MaxLength(50)]
    public string PermitNumber { get; set; } = null!;

    [Required]
    public int VesselId { get; set; }

    [Required]
    public DateOnly IssueDate { get; set; }

    [Required]
    public DateOnly ValidFrom { get; set; }

    [Required]
    public DateOnly ValidUntil { get; set; }

    public List<int> FishingGearIds { get; set; } = new();
}



