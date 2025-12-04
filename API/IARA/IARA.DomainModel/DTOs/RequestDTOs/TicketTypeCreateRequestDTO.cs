using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Request DTO for creating a ticket type
/// </summary>
public class TicketTypeCreateRequestDTO
{
    [Required]
    [MaxLength(100)]
    public string TypeName { get; set; } = null!;

    [Required]
    [Range(1, 3650)]
    public int ValidityDays { get; set; }

    [Required]
    [Range(0, 999999.99)]
    public decimal PriceUnder14 { get; set; }

    [Required]
    [Range(0, 999999.99)]
    public decimal PriceAdult { get; set; }

    [Required]
    [Range(0, 999999.99)]
    public decimal PricePensioner { get; set; }

    [Required]
    public bool IsFreeForDisabled { get; set; }
}
