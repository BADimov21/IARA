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
            InspectionType = dto.InspectionType,
            BatchId = dto.BatchId,
            TicketPurchaseId = dto.TicketPurchaseId,
            IsCompliant = dto.IsCompliant
        };

        Db.Inspections.Add(inspection);
        Db.SaveChanges();

        return inspection.Id;
    }

    public bool Edit(InspectionUpdateRequestDTO dto)
    {
        var inspection = GetAllFromDatabase().Where(i => i.Id == dto.Id).Single();

        inspection.InspectorId = dto.InspectorId;
        inspection.VesselId = dto.VesselId;
        inspection.InspectionDateTime = dto.InspectionDateTime;

        return Db.SaveChanges() > 0;
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
        return query.Where(i => i.InspectionType.Contains(text));
    }

    private IQueryable<InspectionResponseDTO> ApplyMapping(IQueryable<Inspection> query)
    {
        return (from inspection in query
                join inspector in Db.Inspectors on inspection.InspectorId equals inspector.Id
                join inspectorPerson in Db.Persons on inspector.PersonId equals inspectorPerson.Id
                join vessel in Db.Vessels on inspection.VesselId equals vessel.Id into vesselGroup
                from vessel in vesselGroup.DefaultIfEmpty()
                select new InspectionResponseDTO
                {
                    Id = inspection.Id,
                    InspectionDateTime = inspection.InspectionDateTime,
                    InspectionType = inspection.InspectionType,
                    BatchId = inspection.BatchId,
                    TicketPurchaseId = inspection.TicketPurchaseId,
                    IsCompliant = inspection.IsCompliant,
                    InspectorId = inspection.InspectorId,
                    Inspector = new InspectorSimpleResponseDTO
                    {
                        Id = inspector.Id,
                        BadgeNumber = inspector.BadgeNumber,
                        FullName = inspectorPerson.FirstName + " " + inspectorPerson.LastName
                    },
                    VesselId = inspection.VesselId,
                    Vessel = vessel != null ? new VesselSimpleResponseDTO
                    {
                        Id = vessel.Id,
                        InternationalNumber = vessel.InternationalNumber,
                        VesselName = vessel.VesselName
                    } : null
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

        if (filters.VesselId != null)
        {
            query = query.Where(i => i.VesselId == filters.VesselId);
        }

        if (!string.IsNullOrEmpty(filters.InspectionType))
        {
            query = query.Where(i => i.InspectionType.Contains(filters.InspectionType));
        }

        if (filters.BatchId != null)
        {
            query = query.Where(i => i.BatchId == filters.BatchId);
        }

        if (filters.TicketPurchaseId != null)
        {
            query = query.Where(i => i.TicketPurchaseId == filters.TicketPurchaseId);
        }

        if (filters.IsCompliant != null)
        {
            query = query.Where(i => i.IsCompliant == filters.IsCompliant);
        }

        return query;
    }

    private IQueryable<Inspection> GetAllFromDatabase()
    {
        return Db.Inspections.AsQueryable();
    }
}
