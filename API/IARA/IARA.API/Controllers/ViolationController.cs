using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ViolationController : Controller
{
    private readonly IViolationService _violationService;

    public ViolationController(IViolationService violationService)
    {
        _violationService = violationService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<ViolationFilter> filters)
    {
        return Ok(_violationService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_violationService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] ViolationCreateRequestDTO violation)
    {
        return Ok(_violationService.Add(violation));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] ViolationUpdateRequestDTO violation)
    {
        return Ok(_violationService.Edit(violation));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_violationService.Delete(id));
    }
}
