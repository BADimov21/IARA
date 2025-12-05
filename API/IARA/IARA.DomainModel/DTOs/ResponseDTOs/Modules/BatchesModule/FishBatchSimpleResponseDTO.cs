namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.BatchesModule;

/// <summary>
/// Simplified fish batch DTO for use in other DTOs
/// </summary>
public class FishBatchSimpleResponseDTO
{
    public int Id { get; set; }
    public string BatchCode { get; set; } = null!;
    public decimal WeightKg { get; set; }
}


