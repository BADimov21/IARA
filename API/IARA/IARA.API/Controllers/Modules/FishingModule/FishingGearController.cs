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
public class FishingGearController : Controller
{
    private readonly IFishingGearService _fishingGearService;

    public FishingGearController(IFishingGearService fishingGearService)
    {
        _fishingGearService = fishingGearService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<FishingGearFilter> filters)
    {
        return Ok(_fishingGearService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_fishingGearService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] FishingGearCreateRequestDTO gear)
    {
        return Ok(_fishingGearService.Add(gear));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] FishingGearUpdateRequestDTO gear)
    {
        return Ok(_fishingGearService.Edit(gear));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_fishingGearService.Delete(id));
    }
}




