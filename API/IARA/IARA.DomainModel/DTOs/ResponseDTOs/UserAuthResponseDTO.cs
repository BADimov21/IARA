namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Response DTO for user authentication
/// </summary>
public class UserAuthResponseDTO
{
    public int UserId { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string UserType { get; set; } = null!;
    public string Token { get; set; } = null!;
}
