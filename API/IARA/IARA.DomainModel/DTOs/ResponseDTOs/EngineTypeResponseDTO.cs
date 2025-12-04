namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Response DTO for engine type information
/// </summary>
public class EngineTypeResponseDTO
{
    public int Id { get; set; }
    public string TypeName { get; set; } = null!;
    public decimal AverageFuelConsumption { get; set; }
    public string FuelUnit { get; set; } = null!;
}
