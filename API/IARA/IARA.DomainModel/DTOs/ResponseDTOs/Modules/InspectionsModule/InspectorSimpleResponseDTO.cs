namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.InspectionsModule;

/// <summary>
/// Simplified inspector DTO for use in other DTOs
/// </summary>
public class InspectorSimpleResponseDTO
{
    public int Id { get; set; }
    public string BadgeNumber { get; set; } = null!;
    public string FullName { get; set; } = null!;
}


