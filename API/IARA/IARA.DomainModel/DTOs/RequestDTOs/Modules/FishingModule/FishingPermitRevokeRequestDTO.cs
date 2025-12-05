using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;

/// <summary>
/// Request DTO for revoking a fishing permit
/// </summary>
public class FishingPermitRevokeRequestDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(500)]
    public string RevokeReason { get; set; } = null!;
}



