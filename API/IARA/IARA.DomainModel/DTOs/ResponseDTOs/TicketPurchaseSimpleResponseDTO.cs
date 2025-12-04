namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Simplified ticket purchase DTO for use in other DTOs
/// </summary>
public class TicketPurchaseSimpleResponseDTO
{
    public int Id { get; set; }
    public string TicketNumber { get; set; } = null!;
    public DateOnly ValidUntil { get; set; }
    public bool IsValid { get; set; }
}
