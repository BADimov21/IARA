using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

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
