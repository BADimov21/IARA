using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for FishingTrip entity - supports filtering by vessel, permit, departure dates, etc.
/// </summary>
public class FishingTripFilter : IFilter
{
    public int? Id { get; set; }
    public int? VesselId { get; set; }
    public int? PermitId { get; set; }
    public DateTime? DepartureDateTimeFrom { get; set; }
    public DateTime? DepartureDateTimeTo { get; set; }
    public string? DeparturePort { get; set; }
    public DateTime? ArrivalDateTimeFrom { get; set; }
    public DateTime? ArrivalDateTimeTo { get; set; }
    public string? ArrivalPort { get; set; }
    public bool? IsCompleted { get; set; }
    public decimal? MinDurationHours { get; set; }
    public decimal? MaxDurationHours { get; set; }
}
