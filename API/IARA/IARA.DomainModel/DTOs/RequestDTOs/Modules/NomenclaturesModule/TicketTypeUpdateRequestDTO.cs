using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.NomenclaturesModule;

/// <summary>
/// Request DTO for updating a ticket type
/// </summary>
public class TicketTypeUpdateRequestDTO
{
    [Required]
    public int Id { get; set; }

    [MaxLength(100)]
    public string? TypeName { get; set; }

    [Range(1, 3650)]
    public int? ValidityDays { get; set; }

    [Range(0, 999999.99)]
    public decimal? PriceUnder14 { get; set; }

    [Range(0, 999999.99)]
    public decimal? PriceAdult { get; set; }

    [Range(0, 999999.99)]
    public decimal? PricePensioner { get; set; }

    public bool? IsFreeForDisabled { get; set; }
}



