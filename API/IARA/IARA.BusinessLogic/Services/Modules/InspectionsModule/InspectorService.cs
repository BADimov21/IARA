using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.CommonModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.BatchesModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.InspectionsModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.NomenclaturesModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.PersonsModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.TELKModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.TicketsModule;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.VesselsModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.CommonModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.BatchesModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.FishingModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.InspectionsModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.NomenclaturesModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.TELKModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.TicketsModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.VesselsModule;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services.Modules.InspectionsModule;

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

    public bool Edit(InspectorUpdateRequestDTO dto)
    {
        var inspector = GetAllFromDatabase().Where(i => i.Id == dto.Id).Single();

        inspector.PersonId = dto.PersonId;
        inspector.BadgeNumber = dto.BadgeNumber;

        return Db.SaveChanges() > 0;
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
                    PersonId = person.Id,
                    BadgeNumber = inspector.BadgeNumber,
                    Person = new PersonResponseDTO
                    {
                        Id = person.Id,
                        FirstName = person.FirstName,
                        MiddleName = person.MiddleName,
                        LastName = person.LastName,
                        EGN = person.EGN,
                        DateOfBirth = person.DateOfBirth,
                        Address = person.Address,
                        PhoneNumber = person.PhoneNumber
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




