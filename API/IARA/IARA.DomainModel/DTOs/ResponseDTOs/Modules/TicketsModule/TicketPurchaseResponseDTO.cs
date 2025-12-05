using IARA.DomainModel.DTOs.Common;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.TicketsModule;

/// <summary>
/// Response DTO for ticket purchase information
/// </summary>
public class TicketPurchaseResponseDTO
{
    public int Id { get; set; }
    public string TicketNumber { get; set; } = null!;
    public int TicketTypeId { get; set; }
    public NomenclatureDTO TicketType { get; set; } = null!;
    public int PersonId { get; set; }
    public PersonSimpleResponseDTO Person { get; set; } = null!;
    public DateOnly PurchaseDate { get; set; }
    public DateOnly ValidFrom { get; set; }
    public DateOnly ValidUntil { get; set; }
    public decimal PricePaid { get; set; }
    public int? TELKDecisionId { get; set; }
    public bool IsValid => ValidUntil >= DateOnly.FromDateTime(DateTime.UtcNow);
    public List<RecreationalCatchResponseDTO> RecreationalCatches { get; set; } = new();
}



