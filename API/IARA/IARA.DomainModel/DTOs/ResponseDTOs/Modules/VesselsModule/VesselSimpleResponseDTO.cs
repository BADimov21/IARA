namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.VesselsModule;

/// <summary>
/// Simplified vessel DTO for use in other DTOs
/// </summary>
public class VesselSimpleResponseDTO
{
    public int Id { get; set; }
    public string InternationalNumber { get; set; } = null!;
    public string VesselName { get; set; } = null!;
}


