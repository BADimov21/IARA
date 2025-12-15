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
public class FishingTripController : Controller
{
    private readonly IFishingTripService _fishingTripService;

    public FishingTripController(IFishingTripService fishingTripService)
    {
        _fishingTripService = fishingTripService;
    }

    [HttpPost]
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
    [Authorize(Roles = "Admin")]
    public IActionResult Complete([FromBody] FishingTripCompleteRequestDTO trip)
    {
        return Ok(_fishingTripService.Complete(trip));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_fishingTripService.Delete(id));
    }
}




