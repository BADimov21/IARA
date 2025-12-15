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

namespace IARA.API.Controllers.Modules.FishingModule;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class CatchController : Controller
{
    private readonly ICatchService _catchService;

    public CatchController(ICatchService catchService)
    {
        _catchService = catchService;
    }

    [HttpPost]
    public IActionResult GetAll([FromBody] BaseFilter<CatchFilter> filters)
    {
        return Ok(_catchService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_catchService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] CatchCreateRequestDTO catchDto)
    {
        return Ok(_catchService.Add(catchDto));
    }

    [HttpPatch]
    [Authorize(Roles = "Admin")]
    public IActionResult Edit([FromBody] CatchUpdateRequestDTO catchDto)
    {
        return Ok(_catchService.Edit(catchDto));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_catchService.Delete(id));
    }
}




