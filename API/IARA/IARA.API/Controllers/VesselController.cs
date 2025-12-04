using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class VesselController : Controller
{
    private readonly IVesselService _vesselService;

    public VesselController(IVesselService vesselService)
    {
        _vesselService = vesselService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<VesselFilter> filters)
    {
        return Ok(_vesselService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_vesselService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] VesselCreateRequestDTO vessel)
    {
        return Ok(_vesselService.Add(vessel));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] VesselUpdateRequestDTO vessel)
    {
        return Ok(_vesselService.Edit(vessel));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_vesselService.Delete(id));
    }
}
