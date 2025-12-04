namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Simplified fishing permit DTO for use in other DTOs
/// </summary>
public class FishingPermitSimpleResponseDTO
{
    public int Id { get; set; }
    public string PermitNumber { get; set; } = null!;
    public bool IsRevoked { get; set; }
    public DateOnly ValidUntil { get; set; }
}
