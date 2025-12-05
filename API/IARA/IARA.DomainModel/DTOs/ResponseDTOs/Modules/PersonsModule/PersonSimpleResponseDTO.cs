namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;

/// <summary>
/// Simplified person DTO for use in other DTOs
/// </summary>
public class PersonSimpleResponseDTO
{
    public int Id { get; set; }
    public string FullName { get; set; } = null!;
    public string? EGN { get; set; }
}


