using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class CatchController : Controller
{
    private readonly ICatchService _catchService;

    public CatchController(ICatchService catchService)
    {
        _catchService = catchService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<CatchFilter> filters)
    {
        return Ok(_catchService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_catchService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] CatchCreateRequestDTO catchDto)
    {
        return Ok(_catchService.Add(catchDto));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] CatchUpdateRequestDTO catchDto)
    {
        return Ok(_catchService.Edit(catchDto));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_catchService.Delete(id));
    }
}
