using IARA.DomainModel.DTOs.Common;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.VesselsModule;

/// <summary>
/// Response DTO for vessel information
/// </summary>
public class VesselResponseDTO
{
    public int Id { get; set; }
    public string InternationalNumber { get; set; } = null!;
    public string CallSign { get; set; } = null!;
    public string VesselName { get; set; } = null!;
    public decimal Length { get; set; }
    public decimal Width { get; set; }
    public decimal Draft { get; set; }
    public decimal GrossTonnage { get; set; }
    public decimal EnginePower { get; set; }
    public int EngineTypeId { get; set; }
    public NomenclatureDTO EngineType { get; set; } = null!;
    public int OwnerId { get; set; }
    public PersonSimpleResponseDTO Owner { get; set; } = null!;
    public int CaptainId { get; set; }
    public PersonSimpleResponseDTO Captain { get; set; } = null!;
}



