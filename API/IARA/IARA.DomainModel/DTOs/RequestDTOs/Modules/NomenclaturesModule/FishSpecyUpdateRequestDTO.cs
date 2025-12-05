using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.NomenclaturesModule;

/// <summary>
/// Request DTO for updating a fish species
/// </summary>
public class FishSpecyUpdateRequestDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string SpeciesName { get; set; } = null!;
}



