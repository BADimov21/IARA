using IARA.DomainModel.DTOs.Common;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Data Transfer Object for updating a Fish Batch
/// </summary>
public class FishBatchUpdateRequestDTO : BaseDTO
{
    public string BatchCode { get; set; } = string.Empty;
    public int LandingId { get; set; }
    public int SpeciesId { get; set; }
    public decimal WeightKg { get; set; }
}
