using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DotNetEnv;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using IARA.Infrastructure.Services;

namespace IARA.BusinessLogic.Services.Modules.CommonModule;

/// <summary>
/// Service for generating JWT tokens
/// </summary>
public class TokenService : ITokenService
{
    private readonly string _issuer;
    private readonly string _audience;
    private readonly string _key;
    private readonly int _expiresInMinutes;

    public TokenService(IConfiguration configuration)
    {
        Env.Load();

        // Get values from environment variables first, then fall back to configuration
        _issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") 
                  ?? configuration["Jwt:Issuer"] 
                  ?? throw new InvalidOperationException("JWT Issuer not configured");
        
        _audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") 
                    ?? configuration["Jwt:Audience"] 
                    ?? throw new InvalidOperationException("JWT Audience not configured");
        
        _key = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") 
               ?? configuration["Jwt:Key"] 
               ?? throw new InvalidOperationException("JWT Secret Key not configured");
        
        string? expiresConfig = Environment.GetEnvironmentVariable("JWT_EXPIRES_IN_MINUTES") 
                                ?? configuration["Jwt:ExpiresInMinutes"];
        _expiresInMinutes = int.Parse(expiresConfig ?? "60");
    }

    public string GenerateToken(IEnumerable<Claim> claims, DateTime expiresAtUtc)
    {
        DateTime nowUtc = DateTime.UtcNow;

        List<Claim> claimsList = new List<Claim>(claims)
        {
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        byte[] keyBytes = Encoding.UTF8.GetBytes(_key);
        SymmetricSecurityKey signingKey = new SymmetricSecurityKey(keyBytes);

        SigningCredentials signingCredentials =
            new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claimsList,
            notBefore: nowUtc,
            expires: expiresAtUtc,
            signingCredentials: signingCredentials
        );

        JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
        return handler.WriteToken(token);
    }
}