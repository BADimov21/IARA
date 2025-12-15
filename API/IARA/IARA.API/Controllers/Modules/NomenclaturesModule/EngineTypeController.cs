using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.CommonModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.BatchesModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.InspectionsModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.NomenclaturesModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.PersonsModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.TELKModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.TicketsModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.VesselsModule;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers.Modules.NomenclaturesModule;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class EngineTypeController : Controller
{
    private readonly IEngineTypeService _engineTypeService;

    public EngineTypeController(IEngineTypeService engineTypeService)
    {
        _engineTypeService = engineTypeService;
    }

    [HttpPost]
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
    [Authorize(Roles = "Admin")]
    public IActionResult Edit([FromBody] EngineTypeUpdateRequestDTO engineType)
    {
        return Ok(_engineTypeService.Edit(engineType));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_engineTypeService.Delete(id));
    }
}




