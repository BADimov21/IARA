using IARA.DomainModel.DTOs.Common;

namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Response DTO for fishing operation information
/// </summary>
public class FishingOperationResponseDTO
{
    public int Id { get; set; }
    public int TripId { get; set; }
    public int FishingGearId { get; set; }
    public NomenclatureDTO FishingGear { get; set; } = null!;
    public DateTime StartDateTime { get; set; }
    public DateTime? EndDateTime { get; set; }
    public string? Location { get; set; }
    public bool IsCompleted => EndDateTime.HasValue;
    public List<CatchResponseDTO> Catches { get; set; } = new();
}
