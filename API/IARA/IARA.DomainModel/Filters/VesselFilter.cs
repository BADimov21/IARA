using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for Vessel entity - supports filtering by vessel name, international number, owner, etc.
/// </summary>
public class VesselFilter : IFilter
{
    public int? Id { get; set; }
    public string? VesselName { get; set; }
    public string? InternationalNumber { get; set; }
    public string? CallSign { get; set; }
    public int? OwnerId { get; set; }
    public int? CaptainId { get; set; }
    public int? EngineTypeId { get; set; }
    public decimal? MinLength { get; set; }
    public decimal? MaxLength { get; set; }
    public decimal? MinWidth { get; set; }
    public decimal? MaxWidth { get; set; }
    public decimal? MinGrossTonnage { get; set; }
    public decimal? MaxGrossTonnage { get; set; }
    public decimal? MinEnginePower { get; set; }
    public decimal? MaxEnginePower { get; set; }
}
