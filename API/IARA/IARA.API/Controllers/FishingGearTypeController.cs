using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class FishingGearTypeController : Controller
{
    private readonly IFishingGearTypeService _fishingGearTypeService;

    public FishingGearTypeController(IFishingGearTypeService fishingGearTypeService)
    {
        _fishingGearTypeService = fishingGearTypeService;
    }

    [HttpPost]
    [Authorize]
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
    public IActionResult Edit([FromBody] FishingGearTypeUpdateRequestDTO gearType)
    {
        return Ok(_fishingGearTypeService.Edit(gearType));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_fishingGearTypeService.Delete(id));
    }
}
