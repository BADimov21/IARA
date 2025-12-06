using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.Common;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.FishingModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.NomenclaturesModule;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services.Modules.FishingModule;

public class FishingOperationService : BaseService, IFishingOperationService
{
    public FishingOperationService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<FishingOperationResponseDTO> GetAll(BaseFilter<FishingOperationFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<FishingOperationResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(o => o.Id == id));
    }

    public int Add(FishingOperationCreateRequestDTO dto)
    {
        var operation = new FishingOperation
        {
            TripId = dto.TripId,
            FishingGearId = dto.FishingGearId,
            StartDateTime = dto.StartDateTime,
            Location = dto.Location
        };

        Db.FishingOperations.Add(operation);
        Db.SaveChanges();

        return operation.Id;
    }

    public bool Complete(FishingOperationCompleteRequestDTO dto)
    {
        var operation = GetAllFromDatabase().Where(o => o.Id == dto.Id).Single();

        operation.EndDateTime = dto.EndDateTime;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.FishingOperations.Remove(GetAllFromDatabase().Where(o => o.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<FishingOperation> ApplyPagination(IQueryable<FishingOperation> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<FishingOperation> ApplyFreeTextSearch(IQueryable<FishingOperation> query, string text)
    {
        return query.Where(o => (o.Location != null && o.Location.Contains(text)) ||
                                o.FishingGear.GearType.TypeName.Contains(text));
    }

    private IQueryable<FishingOperationResponseDTO> ApplyMapping(IQueryable<FishingOperation> query)
    {
        return (from operation in query
                join trip in Db.FishingTrips on operation.TripId equals trip.Id
                join gear in Db.FishingGears on operation.FishingGearId equals gear.Id
                join gearType in Db.FishingGearTypes on gear.GearTypeId equals gearType.Id
                select new FishingOperationResponseDTO
                {
                    Id = operation.Id,
                    TripId = trip.Id,
                    FishingGearId = gear.Id,
                    FishingGear = new NomenclatureDTO
                    {
                        Id = gear.Id,
                        Name = gearType.TypeName
                    },
                    StartDateTime = operation.StartDateTime,
                    EndDateTime = operation.EndDateTime,
                    Location = operation.Location
                });
    }

    private IQueryable<FishingOperation> ApplyFilters(IQueryable<FishingOperation> query, FishingOperationFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(o => o.Id == filters.Id);
        }

        if (filters.TripId != null)
        {
            query = query.Where(o => o.TripId == filters.TripId);
        }

        if (filters.FishingGearId != null)
        {
            query = query.Where(o => o.FishingGearId == filters.FishingGearId);
        }

        if (filters.StartDateTimeFrom != null)
        {
            query = query.Where(o => o.StartDateTime >= filters.StartDateTimeFrom);
        }

        if (filters.StartDateTimeTo != null)
        {
            query = query.Where(o => o.StartDateTime <= filters.StartDateTimeTo);
        }

        if (filters.EndDateTimeFrom != null)
        {
            query = query.Where(o => o.EndDateTime >= filters.EndDateTimeFrom);
        }

        if (filters.EndDateTimeTo != null)
        {
            query = query.Where(o => o.EndDateTime <= filters.EndDateTimeTo);
        }

        if (!string.IsNullOrEmpty(filters.Location))
        {
            query = query.Where(o => o.Location != null && o.Location.Contains(filters.Location));
        }

        if (filters.IsCompleted != null)
        {
            if (filters.IsCompleted == true)
            {
                query = query.Where(o => o.EndDateTime != null);
            }
            else
            {
                query = query.Where(o => o.EndDateTime == null);
            }
        }

        return query;
    }

    private IQueryable<FishingOperation> GetAllFromDatabase()
    {
        return Db.FishingOperations.AsQueryable();
    }
}
