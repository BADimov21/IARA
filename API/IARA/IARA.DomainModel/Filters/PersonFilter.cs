using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for Person entity - supports filtering by name, EGN, phone number, etc.
/// </summary>
public class PersonFilter : IFilter
{
    public int? Id { get; set; }
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public string? EGN { get; set; }
    public DateOnly? DateOfBirthFrom { get; set; }
    public DateOnly? DateOfBirthTo { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
}
