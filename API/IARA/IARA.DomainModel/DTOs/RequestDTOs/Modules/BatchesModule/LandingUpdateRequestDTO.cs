using IARA.DomainModel.DTOs.Common;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.BatchesModule;

/// <summary>
/// Data Transfer Object for updating a Landing
/// </summary>
public class LandingUpdateRequestDTO : BaseDTO
{
    public int TripId { get; set; }
    public DateTime LandingDateTime { get; set; }
    public string Port { get; set; } = string.Empty;
    public decimal TotalWeightKg { get; set; }
}



