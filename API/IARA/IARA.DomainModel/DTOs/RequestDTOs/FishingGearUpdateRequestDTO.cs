using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for updating fishing gear
/// </summary>
public class FishingGearUpdateRequestDTO
{
    [Required]
    public int Id { get; set; }

    public int? GearTypeId { get; set; }

    [Range(1, int.MaxValue)]
    public int? MeshSize { get; set; }

    [Range(0.01, 99999999.99)]
    public decimal? Length { get; set; }
}
