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

public class ViolationService : BaseService, IViolationService
{
    public ViolationService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<ViolationResponseDTO> GetAll(BaseFilter<ViolationFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<ViolationResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(v => v.Id == id));
    }

    public int Add(ViolationCreateRequestDTO dto)
    {
        var violation = new Violation
        {
            InspectionId = dto.InspectionId,
            Description = dto.Description,
            FineAmount = dto.FineAmount
        };

        Db.Violations.Add(violation);
        Db.SaveChanges();

        return violation.Id;
    }

    public bool Edit(ViolationUpdateRequestDTO dto)
    {
        var violation = GetAllFromDatabase().Where(v => v.Id == dto.Id).Single();

        violation.InspectionId = dto.InspectionId;
        violation.Description = dto.Description;
        if (dto.FineAmount != null) violation.FineAmount = dto.FineAmount.Value;
        
        // Handle payment status update
        if (dto.IsPaid.HasValue)
        {
            violation.IsPaid = dto.IsPaid.Value;
            // If marking as paid and no paid date set, use current date
            if (dto.IsPaid.Value && !violation.PaidDate.HasValue)
            {
                violation.PaidDate = DateTime.Now;
            }
        }
        
        // Allow updating paid date
        if (dto.PaidDate.HasValue)
        {
            violation.PaidDate = dto.PaidDate;
        }

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.Violations.Remove(GetAllFromDatabase().Where(v => v.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<Violation> ApplyPagination(IQueryable<Violation> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<Violation> ApplyFreeTextSearch(IQueryable<Violation> query, string text)
    {
        return query.Where(v => v.Description.Contains(text));
    }

    private IQueryable<ViolationResponseDTO> ApplyMapping(IQueryable<Violation> query)
    {
        return (from violation in query
                select new ViolationResponseDTO
                {
                    Id = violation.Id,
                    InspectionId = violation.InspectionId,
                    Description = violation.Description,
                    FineAmount = violation.FineAmount,
                    IsPaid = violation.IsPaid,
                    PaidDate = violation.PaidDate
                });
    }

    private IQueryable<Violation> ApplyFilters(IQueryable<Violation> query, ViolationFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(v => v.Id == filters.Id);
        }

        if (filters.InspectionId != null)
        {
            query = query.Where(v => v.InspectionId == filters.InspectionId);
        }

        if (!string.IsNullOrEmpty(filters.Description))
        {
            query = query.Where(v => v.Description.Contains(filters.Description));
        }

        if (filters.MinFineAmount != null)
        {
            query = query.Where(v => v.FineAmount >= filters.MinFineAmount);
        }

        if (filters.MaxFineAmount != null)
        {
            query = query.Where(v => v.FineAmount <= filters.MaxFineAmount);
        }

        return query;
    }

    private IQueryable<Violation> GetAllFromDatabase()
    {
        return Db.Violations.AsQueryable();
    }
}




