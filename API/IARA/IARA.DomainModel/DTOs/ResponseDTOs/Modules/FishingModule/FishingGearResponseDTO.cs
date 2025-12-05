using IARA.DomainModel.DTOs.Common;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.FishingModule;

/// <summary>
/// Response DTO for fishing gear information
/// </summary>
public class FishingGearResponseDTO
{
    public int Id { get; set; }
    public int GearTypeId { get; set; }
    public NomenclatureDTO GearType { get; set; } = null!;
    public int? MeshSize { get; set; }
    public decimal? Length { get; set; }
}


