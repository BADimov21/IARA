using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class FishingTripController : Controller
{
    private readonly IFishingTripService _fishingTripService;

    public FishingTripController(IFishingTripService fishingTripService)
    {
        _fishingTripService = fishingTripService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<FishingTripFilter> filters)
    {
        return Ok(_fishingTripService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_fishingTripService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] FishingTripCreateRequestDTO trip)
    {
        return Ok(_fishingTripService.Add(trip));
    }

    [HttpPatch]
    public IActionResult Complete([FromBody] FishingTripCompleteRequestDTO trip)
    {
        return Ok(_fishingTripService.Complete(trip));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_fishingTripService.Delete(id));
    }
}
