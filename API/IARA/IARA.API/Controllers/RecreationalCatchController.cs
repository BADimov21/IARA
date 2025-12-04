using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class RecreationalCatchController : Controller
{
    private readonly IRecreationalCatchService _recreationalCatchService;

    public RecreationalCatchController(IRecreationalCatchService recreationalCatchService)
    {
        _recreationalCatchService = recreationalCatchService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<RecreationalCatchFilter> filters)
    {
        return Ok(_recreationalCatchService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_recreationalCatchService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] RecreationalCatchCreateRequestDTO recreationalCatch)
    {
        return Ok(_recreationalCatchService.Add(recreationalCatch));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_recreationalCatchService.Delete(id));
    }
}
