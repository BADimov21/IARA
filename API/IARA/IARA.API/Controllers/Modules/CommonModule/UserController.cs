using IARA.DomainModel.Base;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers.Modules.CommonModule;

/// <summary>
/// Controller for user management operations (Admin use)
/// For authentication (Register/Login), use AuthenticationController
/// </summary>
[ApiController]
[Route("api/[controller]/[action]")]
[Authorize] // Require authentication for all user management operations
public class UserController : Controller
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Gets all users with filtering and pagination
    /// </summary>
    [HttpPost]
    public IActionResult GetAll([FromBody] BaseFilter<UserFilter> filters)
    {
        return Ok(_userService.GetAll(filters));
    }

    /// <summary>
    /// Gets a specific user by ID
    /// </summary>
    [HttpGet]
    public IActionResult Get([FromQuery] string id)
    {
        return Ok(_userService.Get(id));
    }

    /// <summary>
    /// Deletes a user (Admin only)
    /// </summary>
    [HttpDelete]
    [Authorize(Roles = "Admin")] // Only admins can delete users
    public IActionResult Delete([FromQuery] string id)
    {
        return Ok(_userService.Delete(id));
    }

    /// <summary>
    /// Unbans a user (Admin only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")] // Only admins can unban users
    public IActionResult Unban([FromQuery] string id)
    {
        return Ok(_userService.Unban(id));
    }
}



