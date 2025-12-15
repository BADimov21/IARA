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
public class FishingPermitController : Controller
{
    private readonly IFishingPermitService _fishingPermitService;

    public FishingPermitController(IFishingPermitService fishingPermitService)
    {
        _fishingPermitService = fishingPermitService;
    }

    [HttpPost]
    public IActionResult GetAll([FromBody] BaseFilter<FishingPermitFilter> filters)
    {
        return Ok(_fishingPermitService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_fishingPermitService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] FishingPermitCreateRequestDTO permit)
    {
        return Ok(_fishingPermitService.Add(permit));
    }

    [HttpPatch]
    [Authorize(Roles = "Admin")]
    public IActionResult Revoke([FromBody] FishingPermitRevokeRequestDTO permit)
    {
        return Ok(_fishingPermitService.Revoke(permit));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_fishingPermitService.Delete(id));
    }
}




