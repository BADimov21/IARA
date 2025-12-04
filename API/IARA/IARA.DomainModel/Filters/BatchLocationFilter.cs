using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for BatchLocation entity - supports filtering by batch, location type, arrival/departure dates, etc.
/// </summary>
public class BatchLocationFilter : IFilter
{
    public int? Id { get; set; }
    public int? BatchId { get; set; }
    public string? LocationType { get; set; }
    public string? LocationName { get; set; }
    public DateTime? ArrivedAtFrom { get; set; }
    public DateTime? ArrivedAtTo { get; set; }
    public DateTime? DepartedAtFrom { get; set; }
    public DateTime? DepartedAtTo { get; set; }
    public bool? IsCurrentLocation { get; set; }
}
