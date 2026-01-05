using IARA.DomainModel.DTOs.ResponseDTOs.Modules.ReportsModule;
using System.Collections.Generic;

namespace IARA.Infrastructure.Contracts;

public interface IReportService
{
    /// <summary>
    /// Report 1: Get vessels with permits expiring in the next 1 month
    /// </summary>
    List<VesselExpiringPermitResponseDTO> GetVesselsWithExpiringPermits();
    
    /// <summary>
    /// Report 2: Get ranking of recreational fishermen by total catch weight in the past year
    /// </summary>
    List<RecreationalFishermenRankingResponseDTO> GetRecreationalFishermenRanking();
    
    /// <summary>
    /// Report 3: Get vessel statistics including trip duration and catch data
    /// </summary>
    List<VesselStatisticsResponseDTO> GetVesselStatistics(int year);
    
    /// <summary>
    /// Report 4: Calculate carbon footprint per kg of fish for each vessel
    /// </summary>
    List<VesselCarbonFootprintResponseDTO> GetVesselCarbonFootprint(int year);
}
