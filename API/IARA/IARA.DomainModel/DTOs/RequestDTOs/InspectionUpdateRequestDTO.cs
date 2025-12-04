using IARA.DomainModel.DTOs.Common;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Data Transfer Object for updating an Inspection
/// </summary>
public class InspectionUpdateRequestDTO : BaseDTO
{
    public int InspectorId { get; set; }
    public int VesselId { get; set; }
    public DateTime InspectionDateTime { get; set; }
    public string? Location { get; set; }
    public string? Notes { get; set; }
}
