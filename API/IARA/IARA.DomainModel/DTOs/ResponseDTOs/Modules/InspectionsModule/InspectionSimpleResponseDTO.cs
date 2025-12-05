namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.InspectionsModule;

/// <summary>
/// Simplified inspection DTO for use in other DTOs
/// </summary>
public class InspectionSimpleResponseDTO
{
    public int Id { get; set; }
    public DateTime InspectionDateTime { get; set; }
    public string InspectionType { get; set; } = null!;
    public bool IsCompliant { get; set; }
}


