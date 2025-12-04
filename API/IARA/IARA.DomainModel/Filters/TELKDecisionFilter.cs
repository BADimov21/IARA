using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for TELKDecision entity - supports filtering by person, decision number, issue date, etc.
/// </summary>
public class TELKDecisionFilter : IFilter
{
    public int? Id { get; set; }
    public int? PersonId { get; set; }
    public string? DecisionNumber { get; set; }
    public DateOnly? IssueDateFrom { get; set; }
    public DateOnly? IssueDateTo { get; set; }
    public DateOnly? ValidUntilFrom { get; set; }
    public DateOnly? ValidUntilTo { get; set; }
    public bool? IsValid { get; set; }
}
