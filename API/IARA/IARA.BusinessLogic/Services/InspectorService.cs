using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

public class InspectorService : BaseService, IInspectorService
{
    public InspectorService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<InspectorResponseDTO> GetAll(BaseFilter<InspectorFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<InspectorResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(i => i.Id == id));
    }

    public int Add(InspectorCreateRequestDTO dto)
    {
        var inspector = new Inspector
        {
            PersonId = dto.PersonId,
            BadgeNumber = dto.BadgeNumber
        };

        Db.Inspectors.Add(inspector);
        Db.SaveChanges();

        return inspector.Id;
    }

    public bool Delete(int id)
    {
        Db.Inspectors.Remove(GetAllFromDatabase().Where(i => i.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<Inspector> ApplyPagination(IQueryable<Inspector> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<Inspector> ApplyFreeTextSearch(IQueryable<Inspector> query, string text)
    {
        return query.Where(i => i.BadgeNumber.Contains(text));
    }

    private IQueryable<InspectorResponseDTO> ApplyMapping(IQueryable<Inspector> query)
    {
        return (from inspector in query
                join person in Db.Persons on inspector.PersonId equals person.Id
                select new InspectorResponseDTO
                {
                    Id = inspector.Id,
                    BadgeNumber = inspector.BadgeNumber,
                    Person = new PersonSimpleResponseDTO
                    {
                        Id = person.Id,
                        FirstName = person.FirstName,
                        LastName = person.LastName,
                        EGN = person.EGN
                    }
                });
    }

    private IQueryable<Inspector> ApplyFilters(IQueryable<Inspector> query, InspectorFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(i => i.Id == filters.Id);
        }

        if (filters.PersonId != null)
        {
            query = query.Where(i => i.PersonId == filters.PersonId);
        }

        if (!string.IsNullOrEmpty(filters.BadgeNumber))
        {
            query = query.Where(i => i.BadgeNumber.Contains(filters.BadgeNumber));
        }

        return query;
    }

    private IQueryable<Inspector> GetAllFromDatabase()
    {
        return Db.Inspectors.AsQueryable();
    }
}
