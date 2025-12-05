using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.TELKModule;

/// <summary>
/// Request DTO for creating a TELK decision record
/// </summary>
public class TELKDecisionCreateRequestDTO
{
    [Required]
    public int PersonId { get; set; }

    [Required]
    [MaxLength(50)]
    public string DecisionNumber { get; set; } = null!;

    [Required]
    public DateOnly IssueDate { get; set; }

    public DateOnly? ValidUntil { get; set; }
}



