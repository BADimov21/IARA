using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.NomenclaturesModule;

/// <summary>
/// Request DTO for creating an engine type
/// </summary>
public class EngineTypeCreateRequestDTO
{
    [Required]
    [MaxLength(50)]
    public string TypeName { get; set; } = null!;

    [Required]
    [Range(0.01, 999.99)]
    public decimal AverageFuelConsumption { get; set; }

    [Required]
    [MaxLength(20)]
    public string FuelUnit { get; set; } = null!;
}



