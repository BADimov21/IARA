using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for Violation entity - supports filtering by inspection, fine amount, description, etc.
/// </summary>
public class ViolationFilter : IFilter
{
    public int? Id { get; set; }
    public int? InspectionId { get; set; }
    public string? Description { get; set; }
    public decimal? MinFineAmount { get; set; }
    public decimal? MaxFineAmount { get; set; }
}
