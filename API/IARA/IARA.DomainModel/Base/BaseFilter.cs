namespace IARA.DomainModel.Base;

public class BaseFilter<T> where T : class, IFilter
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public string? FreeTextSearch { get; set; }
    public T? Filters { get; set; }
}