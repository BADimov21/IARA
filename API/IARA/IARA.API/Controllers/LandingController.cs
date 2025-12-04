using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class LandingController : Controller
{
    private readonly ILandingService _landingService;

    public LandingController(ILandingService landingService)
    {
        _landingService = landingService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<LandingFilter> filters)
    {
        return Ok(_landingService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_landingService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] LandingCreateRequestDTO landing)
    {
        return Ok(_landingService.Add(landing));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] LandingUpdateRequestDTO landing)
    {
        return Ok(_landingService.Edit(landing));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_landingService.Delete(id));
    }
}
