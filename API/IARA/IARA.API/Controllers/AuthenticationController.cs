using Microsoft.AspNetCore.Mvc;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.Infrastructure.Services;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationService _authenticationService;

    public AuthenticationController(IAuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }

    /// <summary>
    /// Registers a new user
    /// </summary>
    /// <param name="registerRequestDTO">Registration details</param>
    /// <returns>201 Created on success, 400 Bad Request on failure</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequestDTO)
    {
        try
        {
            await _authenticationService.Register(registerRequestDTO);
            return Created();
        }
        catch (ArgumentException e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Authenticates a user and returns a JWT token
    /// </summary>
    /// <param name="loginRequestDTO">Login credentials</param>
    /// <returns>200 OK with authentication token on success, 400 Bad Request on failure</returns>
    [HttpPost]
    [ProducesResponseType(typeof(AuthenticationResponseDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
    {
        try
        {
            return Ok(await _authenticationService.Login(loginRequestDTO));
        }
        catch (ArgumentException e)
        {
            return BadRequest(e.Message);
        }
    }
}
