using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class InspectorController : Controller
{
    private readonly IInspectorService _inspectorService;

    public InspectorController(IInspectorService inspectorService)
    {
        _inspectorService = inspectorService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<InspectorFilter> filters)
    {
        return Ok(_inspectorService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_inspectorService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] InspectorCreateRequestDTO inspector)
    {
        return Ok(_inspectorService.Add(inspector));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] InspectorUpdateRequestDTO inspector)
    {
        return Ok(_inspectorService.Edit(inspector));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_inspectorService.Delete(id));
    }
}
