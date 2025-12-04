using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class UserController : Controller
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<UserFilter> filters)
    {
        return Ok(_userService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_userService.Get(id));
    }

    [HttpPost]
    public IActionResult Register([FromBody] UserCreateRequestDTO user)
    {
        return Ok(_userService.Register(user));
    }

    [HttpPost]
    public IActionResult Login([FromBody] UserLoginRequestDTO credentials)
    {
        return Ok(_userService.Login(credentials));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_userService.Delete(id));
    }
}
