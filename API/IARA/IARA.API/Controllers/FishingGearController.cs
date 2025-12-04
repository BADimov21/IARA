using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

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
