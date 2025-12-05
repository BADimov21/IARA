using System.Security.Claims;

namespace IARA.Infrastructure.Services;

/// <summary>
/// Service for generating JWT tokens
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Generates a JWT token with the given claims
    /// </summary>
    /// <param name="claims">Claims to include in the token</param>
    /// <param name="expiresAtUtc">Token expiration time in UTC</param>
    /// <returns>JWT token string</returns>
    string GenerateToken(IEnumerable<Claim> claims, DateTime expiresAtUtc);
}

