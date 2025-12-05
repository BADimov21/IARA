using IARA.DomainModel.DTOs.Common;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.FishingModule;

/// <summary>
/// Response DTO for catch information
/// </summary>
public class CatchResponseDTO
{
    public int Id { get; set; }
    public int OperationId { get; set; }
    public int SpeciesId { get; set; }
    public NomenclatureDTO Species { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal WeightKg { get; set; }
}


