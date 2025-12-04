using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for FishingGearType entity - supports filtering by type name
/// </summary>
public class FishingGearTypeFilter : IFilter
{
    public int? Id { get; set; }
    public string? TypeName { get; set; }
}
