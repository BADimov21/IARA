using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for TicketType entity - supports filtering by type name, price range, validity, etc.
/// </summary>
public class TicketTypeFilter : IFilter
{
    public int? Id { get; set; }
    public string? TypeName { get; set; }
    public int? MinValidityDays { get; set; }
    public int? MaxValidityDays { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? IsFreeForDisabled { get; set; }
}
