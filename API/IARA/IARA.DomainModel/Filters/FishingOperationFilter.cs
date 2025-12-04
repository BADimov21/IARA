using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for FishingOperation entity - supports filtering by trip, gear, dates, location, etc.
/// </summary>
public class FishingOperationFilter : IFilter
{
    public int? Id { get; set; }
    public int? TripId { get; set; }
    public int? FishingGearId { get; set; }
    public DateTime? StartDateTimeFrom { get; set; }
    public DateTime? StartDateTimeTo { get; set; }
    public DateTime? EndDateTimeFrom { get; set; }
    public DateTime? EndDateTimeTo { get; set; }
    public string? Location { get; set; }
    public bool? IsCompleted { get; set; }
}
