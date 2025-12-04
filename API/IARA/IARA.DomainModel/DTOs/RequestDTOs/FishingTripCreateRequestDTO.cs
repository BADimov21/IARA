using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for creating a fishing trip
/// </summary>
public class FishingTripCreateRequestDTO
{
    [Required]
    public int VesselId { get; set; }

    [Required]
    public int PermitId { get; set; }

    [Required]
    public DateTime DepartureDateTime { get; set; }

    [Required]
    [MaxLength(100)]
    public string DeparturePort { get; set; } = null!;
}
