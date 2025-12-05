using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.TicketsModule;

/// <summary>
/// Request DTO for creating a recreational catch record
/// </summary>
public class RecreationalCatchCreateRequestDTO
{
    [Required]
    public int TicketPurchaseId { get; set; }

    [Required]
    public int PersonId { get; set; }

    [Required]
    public int SpeciesId { get; set; }

    [Required]
    public DateTime CatchDateTime { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Required]
    [Range(0.01, 999999.99)]
    public decimal WeightKg { get; set; }
}



