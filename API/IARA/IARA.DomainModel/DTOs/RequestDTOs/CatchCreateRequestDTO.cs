using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for creating a catch record
/// </summary>
public class CatchCreateRequestDTO
{
    [Required]
    public int OperationId { get; set; }

    [Required]
    public int SpeciesId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Required]
    [Range(0.01, 99999999.99)]
    public decimal WeightKg { get; set; }
}
