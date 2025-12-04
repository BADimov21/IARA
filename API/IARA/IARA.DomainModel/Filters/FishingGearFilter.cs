using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for FishingGear entity - supports filtering by gear type, mesh size, length, etc.
/// </summary>
public class FishingGearFilter : IFilter
{
    public int? Id { get; set; }
    public int? GearTypeId { get; set; }
    public int? MinMeshSize { get; set; }
    public int? MaxMeshSize { get; set; }
    public decimal? MinLength { get; set; }
    public decimal? MaxLength { get; set; }
}
