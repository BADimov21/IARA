using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for creating a new vessel
/// </summary>
public class VesselCreateRequestDTO
{
    [Required]
    [MaxLength(20)]
    public string InternationalNumber { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    public string CallSign { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string VesselName { get; set; } = null!;

    [Required]
    [Range(0.01, 999.99)]
    public decimal Length { get; set; }

    [Required]
    [Range(0.01, 999.99)]
    public decimal Width { get; set; }

    [Required]
    [Range(0.01, 99999999.99)]
    public decimal GrossTonnage { get; set; }

    [Required]
    [Range(0.01, 99999999.99)]
    public decimal EnginePower { get; set; }

    [Required]
    public int EngineTypeId { get; set; }

    [Required]
    public int OwnerId { get; set; }

    [Required]
    public int CaptainId { get; set; }
}
