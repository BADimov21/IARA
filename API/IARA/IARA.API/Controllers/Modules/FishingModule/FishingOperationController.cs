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
public class FishingOperationController : Controller
{
    private readonly IFishingOperationService _fishingOperationService;

    public FishingOperationController(IFishingOperationService fishingOperationService)
    {
        _fishingOperationService = fishingOperationService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<FishingOperationFilter> filters)
    {
        return Ok(_fishingOperationService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_fishingOperationService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] FishingOperationCreateRequestDTO operation)
    {
        return Ok(_fishingOperationService.Add(operation));
    }

    [HttpPatch]
    public IActionResult Complete([FromBody] FishingOperationCompleteRequestDTO operation)
    {
        return Ok(_fishingOperationService.Complete(operation));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_fishingOperationService.Delete(id));
    }
}




