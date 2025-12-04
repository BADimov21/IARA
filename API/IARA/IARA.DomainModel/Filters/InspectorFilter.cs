using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for Inspector entity - supports filtering by person, badge number, etc.
/// </summary>
public class InspectorFilter : IFilter
{
    public int? Id { get; set; }
    public int? PersonId { get; set; }
    public string? BadgeNumber { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
