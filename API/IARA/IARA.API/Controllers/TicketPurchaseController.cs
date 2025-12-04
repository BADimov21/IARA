using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class TicketPurchaseController : Controller
{
    private readonly ITicketPurchaseService _ticketPurchaseService;

    public TicketPurchaseController(ITicketPurchaseService ticketPurchaseService)
    {
        _ticketPurchaseService = ticketPurchaseService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<TicketPurchaseFilter> filters)
    {
        return Ok(_ticketPurchaseService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_ticketPurchaseService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] TicketPurchaseCreateRequestDTO purchase)
    {
        return Ok(_ticketPurchaseService.Add(purchase));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_ticketPurchaseService.Delete(id));
    }
}
