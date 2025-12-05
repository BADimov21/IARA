using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.InspectionsModule;

/// <summary>
/// Request DTO for creating an inspector
/// </summary>
public class InspectorCreateRequestDTO
{
    [Required]
    public int PersonId { get; set; }

    [Required]
    [MaxLength(50)]
    public string BadgeNumber { get; set; } = null!;
}



