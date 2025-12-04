using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for Catch entity - supports filtering by operation, species, quantity, weight, etc.
/// </summary>
public class CatchFilter : IFilter
{
    public int? Id { get; set; }
    public int? OperationId { get; set; }
    public int? SpeciesId { get; set; }
    public int? MinQuantity { get; set; }
    public int? MaxQuantity { get; set; }
    public decimal? MinWeightKg { get; set; }
    public decimal? MaxWeightKg { get; set; }
}
