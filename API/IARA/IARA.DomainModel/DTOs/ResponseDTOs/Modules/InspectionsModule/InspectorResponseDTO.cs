using IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.InspectionsModule;

/// <summary>
/// Response DTO for inspector information
/// </summary>
public class InspectorResponseDTO
{
    public int Id { get; set; }
    public int PersonId { get; set; }
    public PersonResponseDTO Person { get; set; } = null!;
    public string BadgeNumber { get; set; } = null!;
}



