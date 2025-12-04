using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for Landing entity - supports filtering by trip, port, landing date, etc.
/// </summary>
public class LandingFilter : IFilter
{
    public int? Id { get; set; }
    public int? TripId { get; set; }
    public DateTime? LandingDateTimeFrom { get; set; }
    public DateTime? LandingDateTimeTo { get; set; }
    public string? Port { get; set; }
}
