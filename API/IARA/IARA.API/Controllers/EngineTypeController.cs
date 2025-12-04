using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class EngineTypeController : Controller
{
    private readonly IEngineTypeService _engineTypeService;

    public EngineTypeController(IEngineTypeService engineTypeService)
    {
        _engineTypeService = engineTypeService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<EngineTypeFilter> filters)
    {
        return Ok(_engineTypeService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_engineTypeService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] EngineTypeCreateRequestDTO engineType)
    {
        return Ok(_engineTypeService.Add(engineType));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] EngineTypeUpdateRequestDTO engineType)
    {
        return Ok(_engineTypeService.Edit(engineType));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_engineTypeService.Delete(id));
    }
}
