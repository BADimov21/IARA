using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;

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
}
