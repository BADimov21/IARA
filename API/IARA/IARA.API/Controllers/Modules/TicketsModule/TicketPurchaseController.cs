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

namespace IARA.API.Controllers.Modules.TicketsModule;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class TicketPurchaseController : Controller
{
    private readonly ITicketPurchaseService _ticketPurchaseService;

    public TicketPurchaseController(ITicketPurchaseService ticketPurchaseService)
    {
        _ticketPurchaseService = ticketPurchaseService;
    }

    [HttpPost]
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
    [Authorize(Roles = "Admin")]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_ticketPurchaseService.Delete(id));
    }
}




