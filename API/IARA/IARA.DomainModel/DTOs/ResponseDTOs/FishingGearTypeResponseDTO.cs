namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Response DTO for fishing gear type information
/// </summary>
public class FishingGearTypeResponseDTO
{
    public int Id { get; set; }
    public string TypeName { get; set; } = null!;
}
