using IARA.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IARA.API.Controllers.Modules.ReportsModule;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class ReportController : Controller
{
    private readonly IReportService _reportService;

    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
    }

    /// <summary>
    /// Report 1: Get vessels with permits expiring in the next 1 month
    /// </summary>
    [HttpGet]
    public IActionResult GetVesselsWithExpiringPermits()
    {
        return Ok(_reportService.GetVesselsWithExpiringPermits());
    }

    /// <summary>
    /// Report 2: Get ranking of recreational fishermen by total catch weight in the past year
    /// </summary>
    [HttpGet]
    public IActionResult GetRecreationalFishermenRanking()
    {
        return Ok(_reportService.GetRecreationalFishermenRanking());
    }

    /// <summary>
    /// Report 3: Get vessel statistics for a specific year
    /// </summary>
    [HttpGet]
    public IActionResult GetVesselStatistics([FromQuery] int year = 2025)
    {
        return Ok(_reportService.GetVesselStatistics(year));
    }

    /// <summary>
    /// Report 4: Get carbon footprint per kg of fish for vessels with active permits
    /// </summary>
    [HttpGet]
    public IActionResult GetVesselCarbonFootprint([FromQuery] int year = 2025)
    {
        return Ok(_reportService.GetVesselCarbonFootprint(year));
    }
}
