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
public class FishingGearTypeController : Controller
{
    private readonly IFishingGearTypeService _fishingGearTypeService;

    public FishingGearTypeController(IFishingGearTypeService fishingGearTypeService)
    {
        _fishingGearTypeService = fishingGearTypeService;
    }

    [HttpPost]
    public IActionResult GetAll([FromBody] BaseFilter<FishingGearTypeFilter> filters)
    {
        return Ok(_fishingGearTypeService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_fishingGearTypeService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] FishingGearTypeCreateRequestDTO gearType)
    {
        return Ok(_fishingGearTypeService.Add(gearType));
    }

    [HttpPatch]
    [Authorize(Roles = "Admin")]
    public IActionResult Edit([FromBody] FishingGearTypeUpdateRequestDTO gearType)
    {
        return Ok(_fishingGearTypeService.Edit(gearType));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_fishingGearTypeService.Delete(id));
    }
}




