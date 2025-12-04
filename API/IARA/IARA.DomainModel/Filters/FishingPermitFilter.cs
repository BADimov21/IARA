using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for FishingPermit entity - supports filtering by permit number, vessel, validity dates, etc.
/// </summary>
public class FishingPermitFilter : IFilter
{
    public int? Id { get; set; }
    public string? PermitNumber { get; set; }
    public int? VesselId { get; set; }
    public DateOnly? IssueDateFrom { get; set; }
    public DateOnly? IssueDateTo { get; set; }
    public DateOnly? ValidFromDate { get; set; }
    public DateOnly? ValidUntilDate { get; set; }
    public bool? IsRevoked { get; set; }
    public bool? IsValid { get; set; }
}
