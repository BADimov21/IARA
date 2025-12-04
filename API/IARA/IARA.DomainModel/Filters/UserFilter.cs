using IARA.DomainModel.Base;

namespace IARA.DomainModel.Filters;

/// <summary>
/// Filter for User entity - supports filtering by username, email, user type, active status, etc.
/// </summary>
public class UserFilter : IFilter
{
    public string? UserId { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? UserType { get; set; }
    public int? PersonId { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? CreatedDateFrom { get; set; }
    public DateTime? CreatedDateTo { get; set; }
    public DateTime? LastLoginDateFrom { get; set; }
    public DateTime? LastLoginDateTo { get; set; }
}
