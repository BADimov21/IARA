using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for Inspection entity - supports filtering by inspector, date, type, compliance status, etc.
/// </summary>
public class InspectionFilter : IFilter
{
    public int? Id { get; set; }
    public int? InspectorId { get; set; }
    public DateTime? InspectionDateTimeFrom { get; set; }
    public DateTime? InspectionDateTimeTo { get; set; }
    public string? InspectionType { get; set; }
    public int? VesselId { get; set; }
    public int? BatchId { get; set; }
    public int? TicketPurchaseId { get; set; }
    public bool? IsCompliant { get; set; }
    public bool? HasViolations { get; set; }
}
