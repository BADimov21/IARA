using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class TELKDecisionController : Controller
{
    private readonly ITELKDecisionService _telkDecisionService;

    public TELKDecisionController(ITELKDecisionService telkDecisionService)
    {
        _telkDecisionService = telkDecisionService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<TELKDecisionFilter> filters)
    {
        return Ok(_telkDecisionService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_telkDecisionService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] TELKDecisionCreateRequestDTO decision)
    {
        return Ok(_telkDecisionService.Add(decision));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] TELKDecisionUpdateRequestDTO decision)
    {
        return Ok(_telkDecisionService.Edit(decision));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_telkDecisionService.Delete(id));
    }
}
