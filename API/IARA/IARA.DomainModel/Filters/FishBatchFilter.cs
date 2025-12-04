using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for FishBatch entity - supports filtering by batch code, species, landing, weight, etc.
/// </summary>
public class FishBatchFilter : IFilter
{
    public int? Id { get; set; }
    public string? BatchCode { get; set; }
    public int? LandingId { get; set; }
    public int? SpeciesId { get; set; }
    public decimal? MinWeightKg { get; set; }
    public decimal? MaxWeightKg { get; set; }
    public string? CurrentLocation { get; set; }
    public bool? HasActiveLocation { get; set; }
}
