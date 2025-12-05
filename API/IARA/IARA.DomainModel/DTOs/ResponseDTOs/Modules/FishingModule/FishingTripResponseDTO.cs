using IARA.DomainModel.DTOs.ResponseDTOs.Modules.VesselsModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.BatchesModule;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.FishingModule;

/// <summary>
/// Response DTO for fishing trip information
/// </summary>
public class FishingTripResponseDTO
{
    public int Id { get; set; }
    public int VesselId { get; set; }
    public VesselSimpleResponseDTO Vessel { get; set; } = null!;
    public int PermitId { get; set; }
    public FishingPermitSimpleResponseDTO Permit { get; set; } = null!;
    public DateTime DepartureDateTime { get; set; }
    public string DeparturePort { get; set; } = null!;
    public DateTime? ArrivalDateTime { get; set; }
    public string? ArrivalPort { get; set; }
    public decimal? DurationHours { get; set; }
    public bool IsCompleted => ArrivalDateTime.HasValue;
    public List<FishingOperationResponseDTO> FishingOperations { get; set; } = new();
    public List<LandingResponseDTO> Landings { get; set; } = new();
}



