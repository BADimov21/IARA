using IARA.DomainModel.DTOs.ResponseDTOs.Modules.ReportsModule;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IARA.BusinessLogic.Services.Modules.ReportsModule;

public class ReportService : BaseService, IReportService
{
    public ReportService(BaseServiceInjector injector) : base(injector)
    {
    }

    /// <summary>
    /// Report 1: Vessels with permits expiring in the next 1 month
    /// </summary>
    public List<VesselExpiringPermitResponseDTO> GetVesselsWithExpiringPermits()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var oneMonthFromNow = today.AddMonths(1);

        var expiring = Db.FishingPermits
            .Include(p => p.Vessel)
            .ThenInclude(v => v.Owner)
            .Where(p => !p.IsRevoked && p.ValidUntil >= today && p.ValidUntil <= oneMonthFromNow)
            .Select(p => new VesselExpiringPermitResponseDTO
            {
                VesselId = p.Vessel.Id,
                VesselName = p.Vessel.VesselName,
                InternationalNumber = p.Vessel.InternationalNumber,
                OwnerName = p.Vessel.Owner.FirstName + " " + p.Vessel.Owner.LastName,
                PermitNumber = p.PermitNumber,
                ValidUntil = p.ValidUntil,
                DaysUntilExpiration = p.ValidUntil.DayNumber - today.DayNumber
            })
            .OrderBy(v => v.ValidUntil)
            .ToList();

        return expiring;
    }

    /// <summary>
    /// Report 2: Recreational fishermen ranking by catch weight in past year
    /// </summary>
    public List<RecreationalFishermenRankingResponseDTO> GetRecreationalFishermenRanking()
    {
        var oneYearAgo = DateTime.Now.AddYears(-1);

        var ranking = Db.RecreationalCatches
            .Include(c => c.Person)
            .Where(c => c.CatchDateTime >= oneYearAgo)
            .GroupBy(c => new
            {
                c.PersonId,
                FisherName = c.Person.FirstName + " " + c.Person.LastName
            })
            .Select(g => new RecreationalFishermenRankingResponseDTO
            {
                PersonId = g.Key.PersonId,
                FisherName = g.Key.FisherName,
                TotalCatches = g.Count(),
                TotalWeightKg = g.Sum(c => c.WeightKg)
            })
            .OrderByDescending(r => r.TotalWeightKg)
            .ToList();

        // Add ranking
        for (int i = 0; i < ranking.Count; i++)
        {
            ranking[i].Rank = i + 1;
        }

        return ranking;
    }

    /// <summary>
    /// Report 3: Vessel statistics for trips and catches
    /// </summary>
    public List<VesselStatisticsResponseDTO> GetVesselStatistics(int year)
    {
        var yearStart = new DateTime(year, 1, 1);
        var yearEnd = new DateTime(year, 12, 31, 23, 59, 59);

        var vesselStats = Db.FishingTrips
            .Include(t => t.Vessel)
            .Include(t => t.FishingOperations)
            .ThenInclude(o => o.Catches)
            .Where(t => t.DepartureDateTime >= yearStart && t.DepartureDateTime <= yearEnd && t.ArrivalDateTime.HasValue)
            .GroupBy(t => t.Vessel)
            .Select(g => new
            {
                Vessel = g.Key,
                Trips = g.Select(t => new
                {
                    Duration = (decimal)(t.ArrivalDateTime!.Value - t.DepartureDateTime).TotalHours,
                    CatchWeight = t.FishingOperations.SelectMany(o => o.Catches).Sum(c => c.WeightKg)
                }).ToList()
            })
            .ToList()
            .Where(v => v.Trips.Any())
            .Select(v => new VesselStatisticsResponseDTO
            {
                VesselId = v.Vessel.Id,
                VesselName = v.Vessel.VesselName,
                InternationalNumber = v.Vessel.InternationalNumber,
                TotalTrips = v.Trips.Count,
                AverageTripDuration = v.Trips.Average(t => t.Duration),
                MinTripDuration = v.Trips.Min(t => t.Duration),
                MaxTripDuration = v.Trips.Max(t => t.Duration),
                AverageCatchPerTrip = v.Trips.Any() ? v.Trips.Average(t => t.CatchWeight) : 0,
                MinCatchPerTrip = v.Trips.Any() ? v.Trips.Min(t => t.CatchWeight) : 0,
                MaxCatchPerTrip = v.Trips.Any() ? v.Trips.Max(t => t.CatchWeight) : 0,
                TotalCatchWeightKg = v.Trips.Sum(t => t.CatchWeight)
            })
            .OrderByDescending(v => v.TotalCatchWeightKg)
            .ToList();

        // Add ranking
        for (int i = 0; i < vesselStats.Count; i++)
        {
            vesselStats[i].Rank = i + 1;
        }

        return vesselStats;
    }

    /// <summary>
    /// Report 4: Carbon footprint per kg of fish
    /// </summary>
    public List<VesselCarbonFootprintResponseDTO> GetVesselCarbonFootprint(int year)
    {
        var yearStart = new DateTime(year, 1, 1);
        var yearEnd = new DateTime(year, 12, 31, 23, 59, 59);
        var today = DateOnly.FromDateTime(DateTime.Today);

        // Get vessels with active permits
        var vesselsWithActivePermits = Db.FishingPermits
            .Where(p => !p.IsRevoked && p.ValidUntil >= today)
            .Select(p => p.VesselId)
            .Distinct()
            .ToList();

        if (!vesselsWithActivePermits.Any())
        {
            return new List<VesselCarbonFootprintResponseDTO>();
        }

        // Get all trips in the year for vessels with active permits
        var trips = Db.FishingTrips
            .Where(t => t.DepartureDateTime >= yearStart && 
                       t.DepartureDateTime <= yearEnd && 
                       t.ArrivalDateTime.HasValue &&
                       vesselsWithActivePermits.Contains(t.VesselId))
            .Select(t => new
            {
                t.VesselId,
                t.DepartureDateTime,
                t.ArrivalDateTime,
                TripHours = (t.ArrivalDateTime!.Value - t.DepartureDateTime).TotalHours,
                OperationIds = t.FishingOperations.Select(o => o.Id).ToList()
            })
            .ToList();

        // Get catches for these operations
        var operationIds = trips.SelectMany(t => t.OperationIds).Distinct().ToList();
        var catches = Db.Catches
            .Where(c => operationIds.Contains(c.OperationId))
            .Select(c => new { c.OperationId, c.WeightKg })
            .ToList();

        // Get vessel details
        var vesselIds = trips.Select(t => t.VesselId).Distinct().ToList();
        var vessels = Db.Vessels
            .Include(v => v.EngineType)
            .Where(v => vesselIds.Contains(v.Id) && v.EngineType != null)
            .Select(v => new
            {
                v.Id,
                v.VesselName,
                v.InternationalNumber,
                EngineTypeName = v.EngineType!.TypeName,
                FuelConsumption = v.EngineType.AverageFuelConsumption
            })
            .ToList();

        // Calculate carbon footprint in memory
        var results = new List<VesselCarbonFootprintResponseDTO>();

        foreach (var vessel in vessels)
        {
            var vesselTrips = trips.Where(t => t.VesselId == vessel.Id).ToList();
            var vesselOperationIds = vesselTrips.SelectMany(t => t.OperationIds).ToList();
            var vesselCatches = catches.Where(c => vesselOperationIds.Contains(c.OperationId)).ToList();

            var totalHours = (decimal)vesselTrips.Sum(t => t.TripHours);
            var totalCatch = vesselCatches.Sum(c => c.WeightKg);

            if (totalCatch > 0)
            {
                var totalFuel = totalHours * vessel.FuelConsumption;
                var footprint = totalFuel / totalCatch;

                results.Add(new VesselCarbonFootprintResponseDTO
                {
                    VesselId = vessel.Id,
                    VesselName = vessel.VesselName,
                    InternationalNumber = vessel.InternationalNumber,
                    EngineTypeName = vessel.EngineTypeName,
                    TotalFuelConsumed = totalFuel,
                    TotalCatchWeightKg = totalCatch,
                    TotalTripHours = totalHours,
                    CarbonFootprintPerKg = footprint
                });
            }
        }

        // Sort by footprint and add ranking
        results = results.OrderBy(r => r.CarbonFootprintPerKg).ToList();
        for (int i = 0; i < results.Count; i++)
        {
            results[i].Rank = i + 1;
        }

        return results;
    }
}
