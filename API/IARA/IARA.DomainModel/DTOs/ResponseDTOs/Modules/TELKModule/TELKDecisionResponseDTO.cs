using IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.TELKModule;

/// <summary>
/// Response DTO for TELK decision information
/// </summary>
public class TELKDecisionResponseDTO
{
    public int Id { get; set; }
    public int PersonId { get; set; }
    public PersonSimpleResponseDTO Person { get; set; } = null!;
    public string DecisionNumber { get; set; } = null!;
    public DateOnly IssueDate { get; set; }
    public DateOnly? ValidUntil { get; set; }
    public bool IsValid => !ValidUntil.HasValue || ValidUntil.Value >= DateOnly.FromDateTime(DateTime.UtcNow);
}



