namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.BatchesModule;

/// <summary>
/// Response DTO for landing information
/// </summary>
public class LandingResponseDTO
{
    public int Id { get; set; }
    public int TripId { get; set; }
    public DateTime LandingDateTime { get; set; }
    public string Port { get; set; } = null!;
    public List<FishBatchResponseDTO> FishBatches { get; set; } = new();
}


