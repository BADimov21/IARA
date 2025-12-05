using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;

/// <summary>
/// Request DTO for creating fishing gear
/// </summary>
public class FishingGearCreateRequestDTO
{
    [Required]
    public int GearTypeId { get; set; }

    [Range(1, int.MaxValue)]
    public int? MeshSize { get; set; }

    [Range(0.01, 99999999.99)]
    public decimal? Length { get; set; }
}



