namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.CommonModule;

/// <summary>
/// Response DTO for user information
/// </summary>
public class UserResponseDTO
{
    public string UserId { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string UserType { get; set; } = null!;
    public int? PersonId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastLoginDate { get; set; }
}


