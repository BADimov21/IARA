using IARA.DomainModel.DTOs.Common;

namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Response DTO for fish batch information
/// </summary>
public class FishBatchResponseDTO
{
    public int Id { get; set; }
    public int LandingId { get; set; }
    public int SpeciesId { get; set; }
    public NomenclatureDTO Species { get; set; } = null!;
    public string BatchCode { get; set; } = null!;
    public decimal WeightKg { get; set; }
    public List<BatchLocationResponseDTO> BatchLocations { get; set; } = new();
}
