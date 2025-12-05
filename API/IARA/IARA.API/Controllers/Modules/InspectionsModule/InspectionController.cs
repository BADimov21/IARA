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

namespace IARA.API.Controllers.Modules.InspectionsModule;

[ApiController]
[Route("api/[controller]/[action]")]
public class InspectionController : Controller
{
    private readonly IInspectionService _inspectionService;

    public InspectionController(IInspectionService inspectionService)
    {
        _inspectionService = inspectionService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult GetAll([FromBody] BaseFilter<InspectionFilter> filters)
    {
        return Ok(_inspectionService.GetAll(filters));
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        return Ok(_inspectionService.Get(id));
    }

    [HttpPost]
    public IActionResult Add([FromBody] InspectionCreateRequestDTO inspection)
    {
        return Ok(_inspectionService.Add(inspection));
    }

    [HttpPatch]
    public IActionResult Edit([FromBody] InspectionUpdateRequestDTO inspection)
    {
        return Ok(_inspectionService.Edit(inspection));
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] int id)
    {
        return Ok(_inspectionService.Delete(id));
    }
}




