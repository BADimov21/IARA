namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.InspectionsModule;

/// <summary>
/// Response DTO for violation information
/// </summary>
public class ViolationResponseDTO
{
    public int Id { get; set; }
    public int InspectionId { get; set; }
    public string Description { get; set; } = null!;
    public decimal FineAmount { get; set; }
    public bool IsPaid { get; set; }
    public DateTime? PaidDate { get; set; }
}


