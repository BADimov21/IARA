using IARA.DomainModel.DTOs.RequestDTOs.Modules.CommonModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.BatchesModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.InspectionsModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.NomenclaturesModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.PersonsModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.TELKModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.TicketsModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.VesselsModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.CommonModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.BatchesModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.FishingModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.InspectionsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.NomenclaturesModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.TELKModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.TicketsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.VesselsModule;

namespace IARA.Infrastructure.Services;

/// <summary>
/// Service for user authentication operations
/// </summary>
public interface IAuthenticationService
{
    /// <summary>
    /// Registers a new user
    /// </summary>
    /// <param name="register">Registration details</param>
    Task Register(RegisterRequestDTO register);

    /// <summary>
    /// Authenticates a user and returns a JWT token
    /// </summary>
    /// <param name="login">Login credentials</param>
    /// <returns>Authentication response with JWT token</returns>
    Task<AuthenticationResponseDTO> Login(LoginRequestDTO login);
    
    /// <summary>
    /// Changes a user's password
    /// </summary>
    /// <param name="changePassword">Password change details</param>
    Task ChangePassword(ChangePasswordRequestDTO changePassword);
    
    /// <summary>
    /// Changes a user's email
    /// </summary>
    /// <param name="changeEmail">Email change details</param>
    Task ChangeEmail(ChangeEmailRequestDTO changeEmail);
}


