using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.TELKModule;

/// <summary>
/// Request DTO for updating a TELK decision
/// </summary>
public class TELKDecisionUpdateRequestDTO
{
    [Required]
    public int Id { get; set; }

    public DateOnly? ValidUntil { get; set; }
}



