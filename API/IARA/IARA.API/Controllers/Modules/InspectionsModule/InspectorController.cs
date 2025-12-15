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

namespace IARA.API.Controllers.Modules.InspectionsModule;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class InspectorController : Controller
{
    private readonly IInspectorService _inspectorService;

    public InspectorController(IInspectorService inspectorService)
    {
        _inspectorService = inspectorService;
    }

    [HttpPost]
    public IActionResult GetAll([FromBody] BaseFilter<InspectorFilter> filters)
    {
        return Ok(_inspectorService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_inspectorService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] InspectorCreateRequestDTO inspector)
    {
        return Ok(_inspectorService.Add(inspector));
    }

    [HttpPatch]
    [Authorize(Roles = "Admin")]
    public IActionResult Edit([FromBody] InspectorUpdateRequestDTO inspector)
    {
        return Ok(_inspectorService.Edit(inspector));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_inspectorService.Delete(id));
    }
}




