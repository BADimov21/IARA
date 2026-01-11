using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.BatchesModule;

/// <summary>
/// Request DTO for creating a landing record
/// </summary>
public class LandingCreateRequestDTO
{
    [Required]
    public int TripId { get; set; }

    [Required]
    public DateTime LandingDateTime { get; set; }

    [Required]
    [MaxLength(100)]
    public string Port { get; set; } = null!;

    [Required]
    [Range(0.01, 99999999.99)]
    public decimal TotalWeightKg { get; set; }

    public List<FishBatchCreateRequestDTO> FishBatches { get; set; } = new();
}



