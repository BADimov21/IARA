namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.CommonModule;

/// <summary>
/// Request DTO for user login
/// </summary>
public class LoginRequestDTO
{
    public string UserName { get; set; } = null!;
    public string Password { get; set; } = null!;
}



