namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Response DTO for fishing permit information
/// </summary>
public class FishingPermitResponseDTO
{
    public int Id { get; set; }
    public string PermitNumber { get; set; } = null!;
    public int VesselId { get; set; }
    public VesselSimpleResponseDTO Vessel { get; set; } = null!;
    public DateOnly IssueDate { get; set; }
    public DateOnly ValidFrom { get; set; }
    public DateOnly ValidUntil { get; set; }
    public bool IsRevoked { get; set; }
    public bool IsValid => !IsRevoked && ValidUntil >= DateOnly.FromDateTime(DateTime.UtcNow);
    public List<FishingGearResponseDTO> FishingGears { get; set; } = new();
}
