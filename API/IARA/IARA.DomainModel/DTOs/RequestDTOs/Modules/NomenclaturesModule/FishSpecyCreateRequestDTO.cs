using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.NomenclaturesModule;

/// <summary>
/// Request DTO for creating a fish species
/// </summary>
public class FishSpecyCreateRequestDTO
{
    [Required]
    [MaxLength(100)]
    public string SpeciesName { get; set; } = null!;
}



