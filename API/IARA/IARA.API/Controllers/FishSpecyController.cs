using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class FishSpecyController : Controller
{
    private readonly IFishSpecyService _fishSpecyService;

    public FishSpecyController(IFishSpecyService fishSpecyService)
    {
        _fishSpecyService = fishSpecyService;
    }

    [HttpPost]
    [Authorize]
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
    public IActionResult Edit([FromBody] FishSpecyUpdateRequestDTO specy)
    {
        return Ok(_fishSpecyService.Edit(specy));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_fishSpecyService.Delete(id));
    }
}
