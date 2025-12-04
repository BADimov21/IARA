namespace IARA.DomainModel.DTOs.Common;

/// <summary>
/// Common DTO for nomenclature entities (lookup tables)
/// </summary>
public class NomenclatureDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
}
