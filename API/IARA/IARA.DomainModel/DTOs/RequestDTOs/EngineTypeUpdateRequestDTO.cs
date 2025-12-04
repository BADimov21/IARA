using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for updating an engine type
/// </summary>
public class EngineTypeUpdateRequestDTO
{
    [Required]
    public int Id { get; set; }

    [MaxLength(50)]
    public string? TypeName { get; set; }

    [Range(0.01, 999.99)]
    public decimal? AverageFuelConsumption { get; set; }

    [MaxLength(20)]
    public string? FuelUnit { get; set; }
}
