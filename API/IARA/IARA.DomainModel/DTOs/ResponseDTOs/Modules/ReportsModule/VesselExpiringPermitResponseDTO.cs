using System;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.ReportsModule;

/// <summary>
/// Report 1: Vessels with permits expiring in the next 1 month
/// </summary>
public class VesselExpiringPermitResponseDTO
{
    public int VesselId { get; set; }
    public string VesselName { get; set; } = null!;
    public string InternationalNumber { get; set; } = null!;
    public string OwnerName { get; set; } = null!;
    public string PermitNumber { get; set; } = null!;
    public DateOnly ValidUntil { get; set; }
    public int DaysUntilExpiration { get; set; }
}
