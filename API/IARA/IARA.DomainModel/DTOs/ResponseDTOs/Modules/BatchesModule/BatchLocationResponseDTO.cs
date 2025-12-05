namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.BatchesModule;

/// <summary>
/// Response DTO for batch location information
/// </summary>
public class BatchLocationResponseDTO
{
    public int Id { get; set; }
    public int BatchId { get; set; }
    public string LocationType { get; set; } = null!;
    public string LocationName { get; set; } = null!;
    public DateTime ArrivedAt { get; set; }
    public DateTime? DepartedAt { get; set; }
    public bool IsCurrentLocation => !DepartedAt.HasValue;
}


