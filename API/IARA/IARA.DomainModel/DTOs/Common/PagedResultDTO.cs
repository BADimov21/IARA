namespace IARA.DomainModel.DTOs.Common;

/// <summary>
/// Generic DTO for paginated results
/// </summary>
public class PagedResultDTO<T> where T : class
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public List<T> Items { get; set; } = new();
}
