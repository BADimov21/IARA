namespace IARA.DomainModel.DTOs.RequestDTOs.Modules.CommonModule;

/// <summary>
/// Request DTO for user registration
/// </summary>
public class RegisterRequestDTO
{
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}



