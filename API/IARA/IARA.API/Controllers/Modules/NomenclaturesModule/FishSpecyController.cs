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

namespace IARA.API.Controllers.Modules.NomenclaturesModule;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class FishSpecyController : Controller
{
    private readonly IFishSpecyService _fishSpecyService;

    public FishSpecyController(IFishSpecyService fishSpecyService)
    {
        _fishSpecyService = fishSpecyService;
    }

    [HttpPost]
    public IActionResult GetAll([FromBody] BaseFilter<FishSpecyFilter> filters)
    {
        return Ok(_fishSpecyService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_fishSpecyService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] FishSpecyCreateRequestDTO specy)
    {
        return Ok(_fishSpecyService.Add(specy));
    }

    [HttpPatch]
    [Authorize(Roles = "Admin")]
    public IActionResult Edit([FromBody] FishSpecyUpdateRequestDTO specy)
    {
        return Ok(_fishSpecyService.Edit(specy));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_fishSpecyService.Delete(id));
    }
}




