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

namespace IARA.BusinessLogic.Services.Modules.BatchesModule;

public class LandingService : BaseService, ILandingService
{
    public LandingService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<LandingResponseDTO> GetAll(BaseFilter<LandingFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<LandingResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(l => l.Id == id));
    }

    public int Add(LandingCreateRequestDTO dto)
    {
        var landing = new Landing
        {
            TripId = dto.TripId,
            LandingDateTime = dto.LandingDateTime,
            Port = dto.Port
        };

        Db.Landings.Add(landing);
        Db.SaveChanges();

        return landing.Id;
    }

    public bool Edit(LandingUpdateRequestDTO dto)
    {
        var landing = GetAllFromDatabase().Where(l => l.Id == dto.Id).Single();

        landing.TripId = dto.TripId;
        landing.LandingDateTime = dto.LandingDateTime;
        landing.Port = dto.Port;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.Landings.Remove(GetAllFromDatabase().Where(l => l.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<Landing> ApplyPagination(IQueryable<Landing> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<Landing> ApplyFreeTextSearch(IQueryable<Landing> query, string text)
    {
        return query.Where(l => l.Port.Contains(text));
    }

    private IQueryable<LandingResponseDTO> ApplyMapping(IQueryable<Landing> query)
    {
        return (from landing in query
                select new LandingResponseDTO
                {
                    Id = landing.Id,
                    TripId = landing.TripId,
                    LandingDateTime = landing.LandingDateTime,
                    Port = landing.Port
                });
    }

    private IQueryable<Landing> ApplyFilters(IQueryable<Landing> query, LandingFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(l => l.Id == filters.Id);
        }

        if (filters.TripId != null)
        {
            query = query.Where(l => l.TripId == filters.TripId);
        }

        if (filters.LandingDateTimeFrom != null)
        {
            query = query.Where(l => l.LandingDateTime >= filters.LandingDateTimeFrom);
        }

        if (filters.LandingDateTimeTo != null)
        {
            query = query.Where(l => l.LandingDateTime <= filters.LandingDateTimeTo);
        }

        if (!string.IsNullOrEmpty(filters.Port))
        {
            query = query.Where(l => l.Port.Contains(filters.Port));
        }

        return query;
    }

    private IQueryable<Landing> GetAllFromDatabase()
    {
        return Db.Landings.AsQueryable();
    }
}




