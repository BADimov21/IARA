using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for EngineType entity - supports filtering by type name, fuel consumption, fuel unit
/// </summary>
public class EngineTypeFilter : IFilter
{
    public int? Id { get; set; }
    public string? TypeName { get; set; }
    public decimal? MinAverageFuelConsumption { get; set; }
    public decimal? MaxAverageFuelConsumption { get; set; }
    public string? FuelUnit { get; set; }
}
