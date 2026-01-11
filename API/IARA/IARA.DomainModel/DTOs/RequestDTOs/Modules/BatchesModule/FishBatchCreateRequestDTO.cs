using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.BatchesModule;

/// <summary>
/// Request DTO for creating a fish batch
/// </summary>
public class FishBatchCreateRequestDTO
{
    [Required]
    public int LandingId { get; set; }

    [Required]
    public int SpeciesId { get; set; }

    [Required]
    [MaxLength(50)]
    public string BatchCode { get; set; } = null!;

    [Required]
    [Range(0.01, 99999999.99)]
    public decimal WeightKg { get; set; }

    [Range(1, int.MaxValue)]
    public int? Quantity { get; set; }
}



