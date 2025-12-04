using IARA.DomainModel.DTOs.Common;

namespace IARA.DomainModel.DTOs.RequestDTOs;

/// <summary>
/// Data Transfer Object for updating a Catch
/// </summary>
public class CatchUpdateRequestDTO : BaseDTO
{
    public int OperationId { get; set; }
    public int SpeciesId { get; set; }
    public int Quantity { get; set; }
    public decimal WeightKg { get; set; }
}
