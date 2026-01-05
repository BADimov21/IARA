using System;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.ReportsModule;

/// <summary>
/// Report 3: Vessel statistics for fishing trips and catches
/// </summary>
public class VesselStatisticsResponseDTO
{
    public int VesselId { get; set; }
    public string VesselName { get; set; } = null!;
    public string InternationalNumber { get; set; } = null!;
    
    // Trip duration statistics (in hours)
    public decimal? AverageTripDuration { get; set; }
    public decimal? MinTripDuration { get; set; }
    public decimal? MaxTripDuration { get; set; }
    
    // Catch per trip statistics (in kg)
    public decimal? AverageCatchPerTrip { get; set; }
    public decimal? MinCatchPerTrip { get; set; }
    public decimal? MaxCatchPerTrip { get; set; }
    
    // Total statistics
    public int TotalTrips { get; set; }
    public decimal TotalCatchWeightKg { get; set; }
    public int Rank { get; set; }
}
