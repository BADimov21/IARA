using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

public class TELKDecisionService : BaseService, ITELKDecisionService
{
    public TELKDecisionService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<TELKDecisionResponseDTO> GetAll(BaseFilter<TELKDecisionFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<TELKDecisionResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(t => t.Id == id));
    }

    public int Add(TELKDecisionCreateRequestDTO dto)
    {
        var telkDecision = new TELKDecision
        {
            PersonId = dto.PersonId,
            DecisionNumber = dto.DecisionNumber,
            IssueDate = dto.IssueDate,
            ValidUntil = dto.ValidUntil
        };

        Db.TELKDecisions.Add(telkDecision);
        Db.SaveChanges();

        return telkDecision.Id;
    }

    public bool Edit(TELKDecisionUpdateRequestDTO dto)
    {
        var telkDecision = GetAllFromDatabase().Where(t => t.Id == dto.Id).Single();

        telkDecision.ValidUntil = dto.ValidUntil;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.TELKDecisions.Remove(GetAllFromDatabase().Where(t => t.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<TELKDecision> ApplyPagination(IQueryable<TELKDecision> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<TELKDecision> ApplyFreeTextSearch(IQueryable<TELKDecision> query, string text)
    {
        return query.Where(t => t.DecisionNumber.Contains(text));
    }

    private IQueryable<TELKDecisionResponseDTO> ApplyMapping(IQueryable<TELKDecision> query)
    {
        return (from telk in query
                join person in Db.Persons on telk.PersonId equals person.Id
                select new TELKDecisionResponseDTO
                {
                    Id = telk.Id,
                    DecisionNumber = telk.DecisionNumber,
                    IssueDate = telk.IssueDate,
                    ValidUntil = telk.ValidUntil,
                    Person = new PersonSimpleResponseDTO
                    {
                        Id = person.Id,
                        FirstName = person.FirstName,
                        LastName = person.LastName,
                        EGN = person.EGN
                    }
                });
    }

    private IQueryable<TELKDecision> ApplyFilters(IQueryable<TELKDecision> query, TELKDecisionFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(t => t.Id == filters.Id);
        }

        if (filters.PersonId != null)
        {
            query = query.Where(t => t.PersonId == filters.PersonId);
        }

        if (!string.IsNullOrEmpty(filters.DecisionNumber))
        {
            query = query.Where(t => t.DecisionNumber.Contains(filters.DecisionNumber));
        }

        if (filters.IssueDateFrom != null)
        {
            query = query.Where(t => t.IssueDate >= filters.IssueDateFrom);
        }

        if (filters.IssueDateTo != null)
        {
            query = query.Where(t => t.IssueDate <= filters.IssueDateTo);
        }

        if (filters.ValidUntilFrom != null)
        {
            query = query.Where(t => t.ValidUntil >= filters.ValidUntilFrom);
        }

        if (filters.ValidUntilTo != null)
        {
            query = query.Where(t => t.ValidUntil <= filters.ValidUntilTo);
        }

        if (filters.IsValid != null)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            query = filters.IsValid.Value
                ? query.Where(t => t.ValidUntil >= today)
                : query.Where(t => t.ValidUntil < today);
        }

        return query;
    }

    private IQueryable<TELKDecision> GetAllFromDatabase()
    {
        return Db.TELKDecisions.AsQueryable();
    }
}
