namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Response DTO for inspection information
/// </summary>
public class InspectionResponseDTO
{
    public int Id { get; set; }
    public int InspectorId { get; set; }
    public InspectorSimpleResponseDTO Inspector { get; set; } = null!;
    public DateTime InspectionDateTime { get; set; }
    public string InspectionType { get; set; } = null!;
    public int? VesselId { get; set; }
    public VesselSimpleResponseDTO? Vessel { get; set; }
    public int? BatchId { get; set; }
    public FishBatchSimpleResponseDTO? Batch { get; set; }
    public int? TicketPurchaseId { get; set; }
    public TicketPurchaseSimpleResponseDTO? TicketPurchase { get; set; }
    public bool IsCompliant { get; set; }
    public List<ViolationResponseDTO> Violations { get; set; } = new();
}
