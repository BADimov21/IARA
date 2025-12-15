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

namespace IARA.API.Controllers.Modules.BatchesModule;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class BatchLocationController : Controller
{
    private readonly IBatchLocationService _batchLocationService;

    public BatchLocationController(IBatchLocationService batchLocationService)
    {
        _batchLocationService = batchLocationService;
    }

    [HttpPost]
    public IActionResult GetAll([FromBody] BaseFilter<BatchLocationFilter> filters)
    {
        return Ok(_batchLocationService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_batchLocationService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] BatchLocationCreateRequestDTO location)
    {
        return Ok(_batchLocationService.Add(location));
    }

    [HttpPatch]
    [Authorize(Roles = "Admin")]
    public IActionResult Depart([FromBody] BatchLocationDepartRequestDTO location)
    {
        return Ok(_batchLocationService.Depart(location));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_batchLocationService.Delete(id));
    }
}




