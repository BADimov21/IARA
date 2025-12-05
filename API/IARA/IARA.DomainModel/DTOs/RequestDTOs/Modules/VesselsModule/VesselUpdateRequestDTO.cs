using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.VesselsModule;

/// <summary>
/// Request DTO for updating vessel information
/// </summary>
public class VesselUpdateRequestDTO
{
    [Required]
    public int Id { get; set; }

    [MaxLength(50)]
    public string? CallSign { get; set; }

    [MaxLength(100)]
    public string? VesselName { get; set; }

    [Range(0.01, 999.99)]
    public decimal? Length { get; set; }

    [Range(0.01, 999.99)]
    public decimal? Width { get; set; }

    [Range(0.01, 99999999.99)]
    public decimal? GrossTonnage { get; set; }

    [Range(0.01, 99999999.99)]
    public decimal? EnginePower { get; set; }

    public int? EngineTypeId { get; set; }

    public int? OwnerId { get; set; }

    public int? CaptainId { get; set; }
}



