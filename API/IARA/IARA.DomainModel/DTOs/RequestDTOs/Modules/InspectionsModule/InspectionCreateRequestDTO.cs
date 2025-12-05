using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.InspectionsModule;

/// <summary>
/// Request DTO for creating an inspection
/// </summary>
public class InspectionCreateRequestDTO
{
    [Required]
    public int InspectorId { get; set; }

    [Required]
    public DateTime InspectionDateTime { get; set; }

    [Required]
    [MaxLength(50)]
    public string InspectionType { get; set; } = null!;

    public int? VesselId { get; set; }

    public int? BatchId { get; set; }

    public int? TicketPurchaseId { get; set; }

    [Required]
    public bool IsCompliant { get; set; }

    public List<ViolationCreateRequestDTO> Violations { get; set; } = new();
}



