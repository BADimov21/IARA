namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.NomenclaturesModule;

/// <summary>
/// Response DTO for ticket type information
/// </summary>
public class TicketTypeResponseDTO
{
    public int Id { get; set; }
    public string TypeName { get; set; } = null!;
    public int ValidityDays { get; set; }
    public decimal PriceUnder14 { get; set; }
    public decimal PriceAdult { get; set; }
    public decimal PricePensioner { get; set; }
    public bool IsFreeForDisabled { get; set; }
}


