using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for TicketPurchase entity - supports filtering by person, ticket type, validity dates, etc.
/// </summary>
public class TicketPurchaseFilter : IFilter
{
    public int? Id { get; set; }
    public string? TicketNumber { get; set; }
    public int? TicketTypeId { get; set; }
    public int? PersonId { get; set; }
    public DateOnly? PurchaseDateFrom { get; set; }
    public DateOnly? PurchaseDateTo { get; set; }
    public DateOnly? ValidFromDate { get; set; }
    public DateOnly? ValidUntilDate { get; set; }
    public bool? IsValid { get; set; }
    public decimal? MinPricePaid { get; set; }
    public decimal? MaxPricePaid { get; set; }
    public int? TELKDecisionId { get; set; }
}
