using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
        IConfigurationSection jwtSection = configuration.GetSection("Jwt");
        _issuer = jwtSection["Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer missing");
        _audience = jwtSection["Audience"] ?? throw new InvalidOperationException("Jwt:Audience missing");
        _key = jwtSection["Key"] ?? throw new InvalidOperationException("Jwt:Key missing");
        _expiresInMinutes = int.Parse(jwtSection["ExpiresInMinutes"] ?? "60");
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



