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
public class FishBatchController : Controller
{
    private readonly IFishBatchService _fishBatchService;

    public FishBatchController(IFishBatchService fishBatchService)
    {
        _fishBatchService = fishBatchService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<FishBatchFilter> filters)
    {
        return Ok(_fishBatchService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_fishBatchService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] FishBatchCreateRequestDTO batch)
    {
        return Ok(_fishBatchService.Add(batch));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] FishBatchUpdateRequestDTO batch)
    {
        return Ok(_fishBatchService.Edit(batch));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_fishBatchService.Delete(id));
    }
}




