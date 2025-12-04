using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for creating a fishing operation
/// </summary>
public class FishingOperationCreateRequestDTO
{
    [Required]
    public int TripId { get; set; }

    [Required]
    public int FishingGearId { get; set; }

    [Required]
    public DateTime StartDateTime { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }
}
