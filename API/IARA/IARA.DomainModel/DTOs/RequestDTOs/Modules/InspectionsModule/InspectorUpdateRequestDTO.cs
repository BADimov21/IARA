using IARA.DomainModel.DTOs.Common;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.InspectionsModule;

/// <summary>
/// Data Transfer Object for updating an Inspector
/// </summary>
public class InspectorUpdateRequestDTO : BaseDTO
{
    public int PersonId { get; set; }
    public string BadgeNumber { get; set; } = string.Empty;
}



