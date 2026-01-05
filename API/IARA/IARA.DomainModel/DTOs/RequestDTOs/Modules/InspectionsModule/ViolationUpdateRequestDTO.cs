using IARA.DomainModel.DTOs.Common;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.InspectionsModule;

/// <summary>
/// Data Transfer Object for updating a Violation
/// </summary>
public class ViolationUpdateRequestDTO : BaseDTO
{
    public int InspectionId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal? FineAmount { get; set; }
    public bool? IsPaid { get; set; }
    public DateTime? PaidDate { get; set; }
}



