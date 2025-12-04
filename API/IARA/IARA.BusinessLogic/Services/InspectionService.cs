using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

public class InspectionService : BaseService, IInspectionService
{
    public InspectionService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<InspectionResponseDTO> GetAll(BaseFilter<InspectionFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<InspectionResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(i => i.Id == id));
    }

    public int Add(InspectionCreateRequestDTO dto)
    {
        var inspection = new Inspection
        {
            InspectorId = dto.InspectorId,
            VesselId = dto.VesselId,
            InspectionDateTime = dto.InspectionDateTime,
            Location = dto.Location,
            Notes = dto.Notes
        };

        Db.Inspections.Add(inspection);
        Db.SaveChanges();

        return inspection.Id;
    }

    public bool Delete(int id)
    {
        Db.Inspections.Remove(GetAllFromDatabase().Where(i => i.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<Inspection> ApplyPagination(IQueryable<Inspection> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<Inspection> ApplyFreeTextSearch(IQueryable<Inspection> query, string text)
    {
        return query.Where(i => i.Location.Contains(text) || (i.Notes != null && i.Notes.Contains(text)));
    }

    private IQueryable<InspectionResponseDTO> ApplyMapping(IQueryable<Inspection> query)
    {
        return (from inspection in query
                join inspector in Db.Inspectors on inspection.InspectorId equals inspector.Id
                join inspectorPerson in Db.Persons on inspector.PersonId equals inspectorPerson.Id
                join vessel in Db.Vessels on inspection.VesselId equals vessel.Id
                join owner in Db.Persons on vessel.OwnerId equals owner.Id
                select new InspectionResponseDTO
                {
                    Id = inspection.Id,
                    InspectionDateTime = inspection.InspectionDateTime,
                    Location = inspection.Location,
                    Notes = inspection.Notes,
                    Inspector = new InspectorSimpleResponseDTO
                    {
                        Id = inspector.Id,
                        BadgeNumber = inspector.BadgeNumber,
                        Person = new PersonSimpleResponseDTO
                        {
                            Id = inspectorPerson.Id,
                            FirstName = inspectorPerson.FirstName,
                            LastName = inspectorPerson.LastName,
                            EGN = inspectorPerson.EGN
                        }
                    },
                    Vessel = new VesselSimpleResponseDTO
                    {
                        Id = vessel.Id,
                        Name = vessel.Name,
                        CFR = vessel.CFR,
                        RegistrationNumber = vessel.RegistrationNumber,
                        Owner = new PersonSimpleResponseDTO
                        {
                            Id = owner.Id,
                            FirstName = owner.FirstName,
                            LastName = owner.LastName,
                            EGN = owner.EGN
                        }
                    }
                });
    }

    private IQueryable<Inspection> ApplyFilters(IQueryable<Inspection> query, InspectionFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(i => i.Id == filters.Id);
        }

        if (filters.InspectorId != null)
        {
            query = query.Where(i => i.InspectorId == filters.InspectorId);
        }

        if (filters.VesselId != null)
        {
            query = query.Where(i => i.VesselId == filters.VesselId);
        }

        if (filters.InspectionDateTimeFrom != null)
        {
            query = query.Where(i => i.InspectionDateTime >= filters.InspectionDateTimeFrom);
        }

        if (filters.InspectionDateTimeTo != null)
        {
            query = query.Where(i => i.InspectionDateTime <= filters.InspectionDateTimeTo);
        }

        if (!string.IsNullOrEmpty(filters.Location))
        {
            query = query.Where(i => i.Location.Contains(filters.Location));
        }

        return query;
    }

    private IQueryable<Inspection> GetAllFromDatabase()
    {
        return Db.Inspections.AsQueryable();
    }
}
