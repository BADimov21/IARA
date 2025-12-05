using System.ComponentModel.DataAnnotations;

namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.BatchesModule;

/// <summary>
/// Request DTO for recording batch departure from location
/// </summary>
public class BatchLocationDepartRequestDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    public DateTime DepartedAt { get; set; }
}



