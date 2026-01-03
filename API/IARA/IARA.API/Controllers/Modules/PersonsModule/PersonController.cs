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
using System.Security.Claims;

namespace IARA.API.Controllers.Modules.PersonsModule;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class PersonController : Controller
{
    private readonly IPersonService _personService;

    public PersonController(IPersonService personService)
    {
        _personService = personService;
    }

    [HttpPost]
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
    [Authorize(Roles = "Admin")]
    public IActionResult Edit([FromBody] PersonUpdateRequestDTO person)
    {
        return Ok(_personService.Edit(person));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_personService.Delete(id));
    }

    /// <summary>
    /// Registers personal information for the current authenticated user
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> RegisterPersonInfo([FromBody] UserPersonInfoRequestDTO dto)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var personId = await _personService.RegisterUserPersonInfo(userId, dto);
            return Ok(new { personId, message = "Personal information registered successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while registering personal information", error = ex.Message });
        }
    }

    /// <summary>
    /// Checks if the current user has completed their personal information
    /// </summary>
    [HttpGet]
    public IActionResult HasCompletedPersonalInfo()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var hasCompleted = _personService.HasCompletedPersonalInfo(userId);
            var personId = _personService.GetPersonIdByUserId(userId);
            
            return Ok(new { hasCompleted, personId });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }
}




