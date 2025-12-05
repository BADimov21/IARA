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

namespace IARA.API.Controllers.Modules.PersonsModule;

[ApiController]
[Route("api/[controller]/[action]")]
public class PersonController : Controller
{
    private readonly IPersonService _personService;

    public PersonController(IPersonService personService)
    {
        _personService = personService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<PersonFilter> filters)
    {
        return Ok(_personService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_personService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] PersonCreateRequestDTO person)
    {
        return Ok(_personService.Add(person));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] PersonUpdateRequestDTO person)
    {
        return Ok(_personService.Edit(person));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_personService.Delete(id));
    }
}




