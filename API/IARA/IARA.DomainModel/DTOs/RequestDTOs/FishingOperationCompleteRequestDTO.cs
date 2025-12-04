using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for completing a fishing operation
/// </summary>
public class FishingOperationCompleteRequestDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    public DateTime EndDateTime { get; set; }

    public List<CatchCreateRequestDTO> Catches { get; set; } = new();
}
