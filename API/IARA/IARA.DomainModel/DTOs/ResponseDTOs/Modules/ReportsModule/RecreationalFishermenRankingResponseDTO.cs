using System;

namespace IARA.DomainModel.DTOs.ResponseDTOs.Modules.ReportsModule;

/// <summary>
/// Report 2: Recreational fishermen ranking by catch weight
/// </summary>
public class RecreationalFishermenRankingResponseDTO
{
    public int PersonId { get; set; }
    public string FisherName { get; set; } = null!;
    public int TotalCatches { get; set; }
    public decimal TotalWeightKg { get; set; }
    public int Rank { get; set; }
}
