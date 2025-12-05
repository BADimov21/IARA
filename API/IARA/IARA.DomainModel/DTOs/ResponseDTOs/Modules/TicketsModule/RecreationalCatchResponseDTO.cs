using IARA.DomainModel.DTOs.Common;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.TicketsModule;

/// <summary>
/// Response DTO for recreational catch information
/// </summary>
public class RecreationalCatchResponseDTO
{
    public int Id { get; set; }
    public int TicketPurchaseId { get; set; }
    public int PersonId { get; set; }
    public PersonSimpleResponseDTO Person { get; set; } = null!;
    public int SpeciesId { get; set; }
    public NomenclatureDTO Species { get; set; } = null!;
    public DateTime CatchDateTime { get; set; }
    public string? Location { get; set; }
    public int Quantity { get; set; }
    public decimal WeightKg { get; set; }
}



