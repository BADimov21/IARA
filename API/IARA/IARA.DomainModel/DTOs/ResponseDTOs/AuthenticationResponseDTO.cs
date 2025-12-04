namespace IARA.DomainModel.DTOs.ResponseDTOs;

/// <summary>
/// Response DTO for authentication containing JWT token
/// </summary>
public class AuthenticationResponseDTO
{
    public string AccessToken { get; set; } = null!;
    public DateTime ExpiresAtUtc { get; set; }
    public string UserName { get; set; } = null!;
    public IList<string> Roles { get; set; } = new List<string>();
}
