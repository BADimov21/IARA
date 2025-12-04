using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for RecreationalCatch entity - supports filtering by person, ticket, species, date, etc.
/// </summary>
public class RecreationalCatchFilter : IFilter
{
    public int? Id { get; set; }
    public int? TicketPurchaseId { get; set; }
    public int? PersonId { get; set; }
    public int? SpeciesId { get; set; }
    public DateTime? CatchDateTimeFrom { get; set; }
    public DateTime? CatchDateTimeTo { get; set; }
    public string? Location { get; set; }
    public int? MinQuantity { get; set; }
    public int? MaxQuantity { get; set; }
    public decimal? MinWeightKg { get; set; }
    public decimal? MaxWeightKg { get; set; }
}
