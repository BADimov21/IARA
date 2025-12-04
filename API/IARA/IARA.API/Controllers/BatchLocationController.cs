using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class BatchLocationController : Controller
{
    private readonly IBatchLocationService _batchLocationService;

    public BatchLocationController(IBatchLocationService batchLocationService)
    {
        _batchLocationService = batchLocationService;
    }

    [HttpPost]
    [Authorize]
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
    public IActionResult Depart([FromBody] BatchLocationDepartRequestDTO location)
    {
        return Ok(_batchLocationService.Depart(location));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_batchLocationService.Delete(id));
    }
}
