using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for FishSpecy entity - supports filtering by species name
/// </summary>
public class FishSpecyFilter : IFilter
{
    public int? Id { get; set; }
    public string? SpeciesName { get; set; }
}
