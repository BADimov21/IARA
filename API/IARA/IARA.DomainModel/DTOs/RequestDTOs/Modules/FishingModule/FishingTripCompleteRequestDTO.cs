using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;

/// <summary>
/// Request DTO for completing a fishing trip
/// </summary>
public class FishingTripCompleteRequestDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    public DateTime ArrivalDateTime { get; set; }

    [Required]
    [MaxLength(100)]
    public string ArrivalPort { get; set; } = null!;
}



