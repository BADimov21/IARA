using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for creating a violation record
/// </summary>
public class ViolationCreateRequestDTO
{
    [Required]
    public int InspectionId { get; set; }

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = null!;

    [Required]
    [Range(0.01, 99999999.99)]
    public decimal FineAmount { get; set; }
}
