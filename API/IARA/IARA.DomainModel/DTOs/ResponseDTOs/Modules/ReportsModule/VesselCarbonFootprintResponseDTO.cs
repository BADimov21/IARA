using System;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.ReportsModule;

/// <summary>
/// Report 4: Carbon footprint per kg of fish for each vessel
/// </summary>
public class VesselCarbonFootprintResponseDTO
{
    public int VesselId { get; set; }
    public string VesselName { get; set; } = null!;
    public string InternationalNumber { get; set; } = null!;
    public string EngineTypeName { get; set; } = null!;
    
    public decimal TotalFuelConsumed { get; set; } // in liters
    public decimal TotalCatchWeightKg { get; set; }
    public decimal TotalTripHours { get; set; }
    
    /// <summary>
    /// Carbon footprint: liters of fuel per kg of fish
    /// </summary>
    public decimal CarbonFootprintPerKg { get; set; }
    
    public int Rank { get; set; }
}
