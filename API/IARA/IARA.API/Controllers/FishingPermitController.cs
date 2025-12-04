using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class FishingPermitController : Controller
{
    private readonly IFishingPermitService _fishingPermitService;

    public FishingPermitController(IFishingPermitService fishingPermitService)
    {
        _fishingPermitService = fishingPermitService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<FishingPermitFilter> filters)
    {
        return Ok(_fishingPermitService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_fishingPermitService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] FishingPermitCreateRequestDTO permit)
    {
        return Ok(_fishingPermitService.Add(permit));
    }

    [HttpPatch]
    public IActionResult Revoke([FromBody] FishingPermitRevokeRequestDTO permit)
    {
        return Ok(_fishingPermitService.Revoke(permit));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_fishingPermitService.Delete(id));
    }
}
