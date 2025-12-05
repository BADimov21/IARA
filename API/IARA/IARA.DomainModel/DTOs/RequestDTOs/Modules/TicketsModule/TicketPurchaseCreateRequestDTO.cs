using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.TicketsModule;

/// <summary>
/// Request DTO for purchasing a ticket
/// </summary>
public class TicketPurchaseCreateRequestDTO
{
    [Required]
    public int TicketTypeId { get; set; }

    [Required]
    public int PersonId { get; set; }

    [Required]
    public DateOnly PurchaseDate { get; set; }

    [Required]
    public DateOnly ValidFrom { get; set; }

    [Required]
    public DateOnly ValidUntil { get; set; }

    [Required]
    [Range(0, 999999.99)]
    public decimal PricePaid { get; set; }

    public int? TELKDecisionId { get; set; }
}



