using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

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
