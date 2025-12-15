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
public class ViolationController : Controller
{
    private readonly IViolationService _violationService;

    public ViolationController(IViolationService violationService)
    {
        _violationService = violationService;
    }

    [HttpPost]
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
    [Authorize(Roles = "Admin")]
    public IActionResult Edit([FromBody] ViolationUpdateRequestDTO violation)
    {
        return Ok(_violationService.Edit(violation));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_violationService.Delete(id));
    }
}




