namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.CommonModule;

/// <summary>
/// Response DTO for user authentication
/// </summary>
public class UserAuthResponseDTO
{
    public string UserId { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string UserType { get; set; } = null!;
    public string Token { get; set; } = null!;
}


