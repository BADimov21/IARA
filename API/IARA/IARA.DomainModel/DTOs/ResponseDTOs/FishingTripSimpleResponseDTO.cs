namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Simplified fishing trip DTO for use in other DTOs
/// </summary>
public class FishingTripSimpleResponseDTO
{
    public int Id { get; set; }
    public DateTime DepartureDateTime { get; set; }
    public string DeparturePort { get; set; } = null!;
    public bool IsCompleted { get; set; }
}
