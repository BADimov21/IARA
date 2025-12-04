using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.Infrastructure.Services;
using IARA.Persistence.Data.Entities;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace IARA.BusinessLogic.Services;

/// <summary>
/// Service for user authentication operations
/// </summary>
public class AuthenticationService : IAuthenticationService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenService _tokenService;

    public AuthenticationService(UserManager<User> userManager, SignInManager<User> signInManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    public async Task Register(RegisterRequestDTO register)
    {
        User? existing = await _userManager.FindByNameAsync(register.UserName);
        if (existing is not null)
        {
            throw new ArgumentException("User already exists");
        }

        var user = new User
        {
            UserName = register.UserName,
            Email = register.Email,
            EmailConfirmed = true,
            UserType = "User",
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };

        IdentityResult result = await _userManager.CreateAsync(user, register.Password);

        if (!result.Succeeded)
        {
            string errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new ArgumentException($"Unsuccessful Registration: {errors}");
        }

        // Optionally add default role
        // await _userManager.AddToRoleAsync(user, "User");
    }

    public async Task<AuthenticationResponseDTO> Login(LoginRequestDTO login)
    {
        User? user = await _userManager.FindByNameAsync(login.UserName);
        if (user is null)
        {
            throw new ArgumentException("Invalid username or password.");
        }

        SignInResult signInResult =
            await _signInManager.CheckPasswordSignInAsync(user, login.Password, lockoutOnFailure: false);

        if (!signInResult.Succeeded)
        {
            throw new ArgumentException("Invalid username or password.");
        }

        // Update last login date
        user.LastLoginDate = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        IList<Claim> userClaims = await _userManager.GetClaimsAsync(user);
        IList<string> roles = await _userManager.GetRolesAsync(user);

        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName ?? string.Empty),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty)
        };

        claims.AddRange(userClaims);

        foreach (string role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        DateTime expiresAtUtc = DateTime.UtcNow.AddMinutes(60);
        string token = _tokenService.GenerateToken(claims, expiresAtUtc);

        AuthenticationResponseDTO response = new AuthenticationResponseDTO
        {
            AccessToken = token,
            ExpiresAtUtc = expiresAtUtc,
            UserName = user.UserName ?? string.Empty,
            Roles = roles
        };

        return response;
    }
}
