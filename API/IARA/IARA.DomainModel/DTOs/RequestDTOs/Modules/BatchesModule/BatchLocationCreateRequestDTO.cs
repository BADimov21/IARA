using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.BatchesModule;

/// <summary>
/// Request DTO for creating a batch location record
/// </summary>
public class BatchLocationCreateRequestDTO
{
    [Required]
    public int BatchId { get; set; }

    [Required]
    [MaxLength(50)]
    public string LocationType { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string LocationName { get; set; } = null!;

    [Required]
    public DateTime ArrivedAt { get; set; }
}



