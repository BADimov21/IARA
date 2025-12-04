namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Response DTO for fish species information
/// </summary>
public class FishSpecyResponseDTO
{
    public int Id { get; set; }
    public string SpeciesName { get; set; } = null!;
}
