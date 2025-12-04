using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class TicketTypeController : Controller
{
    private readonly ITicketTypeService _ticketTypeService;

    public TicketTypeController(ITicketTypeService ticketTypeService)
    {
        _ticketTypeService = ticketTypeService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<TicketTypeFilter> filters)
    {
        return Ok(_ticketTypeService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_ticketTypeService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] TicketTypeCreateRequestDTO ticketType)
    {
        return Ok(_ticketTypeService.Add(ticketType));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] TicketTypeUpdateRequestDTO ticketType)
    {
        return Ok(_ticketTypeService.Edit(ticketType));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_ticketTypeService.Delete(id));
    }
}
