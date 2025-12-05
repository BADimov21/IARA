using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.Common;
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

public class BatchLocationService : BaseService, IBatchLocationService
{
    public BatchLocationService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<BatchLocationResponseDTO> GetAll(BaseFilter<BatchLocationFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<BatchLocationResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(bl => bl.Id == id));
    }

    public int Add(BatchLocationCreateRequestDTO dto)
    {
        var batchLocation = new BatchLocation
        {
            BatchId = dto.BatchId,
            LocationType = dto.LocationType,
            LocationName = dto.LocationName,
            ArrivedAt = dto.ArrivedAt
        };

        Db.BatchLocations.Add(batchLocation);
        Db.SaveChanges();

        return batchLocation.Id;
    }

    public bool Depart(BatchLocationDepartRequestDTO dto)
    {
        var batchLocation = GetAllFromDatabase().Where(bl => bl.Id == dto.Id).Single();

        batchLocation.DepartedAt = dto.DepartedAt;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.BatchLocations.Remove(GetAllFromDatabase().Where(bl => bl.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<BatchLocation> ApplyPagination(IQueryable<BatchLocation> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<BatchLocation> ApplyFreeTextSearch(IQueryable<BatchLocation> query, string text)
    {
        return query.Where(bl => bl.LocationName.Contains(text) || bl.LocationType.Contains(text));
    }

    private IQueryable<BatchLocationResponseDTO> ApplyMapping(IQueryable<BatchLocation> query)
    {
        return (from batchLocation in query
                select new BatchLocationResponseDTO
                {
                    Id = batchLocation.Id,
                    BatchId = batchLocation.BatchId,
                    LocationType = batchLocation.LocationType,
                    LocationName = batchLocation.LocationName,
                    ArrivedAt = batchLocation.ArrivedAt,
                    DepartedAt = batchLocation.DepartedAt
                });
    }

    private IQueryable<BatchLocation> ApplyFilters(IQueryable<BatchLocation> query, BatchLocationFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(bl => bl.Id == filters.Id);
        }

        if (filters.BatchId != null)
        {
            query = query.Where(bl => bl.BatchId == filters.BatchId);
        }

        if (!string.IsNullOrEmpty(filters.LocationType))
        {
            query = query.Where(bl => bl.LocationType.Contains(filters.LocationType));
        }

        if (!string.IsNullOrEmpty(filters.LocationName))
        {
            query = query.Where(bl => bl.LocationName.Contains(filters.LocationName));
        }

        if (filters.ArrivedAtFrom != null)
        {
            query = query.Where(bl => bl.ArrivedAt >= filters.ArrivedAtFrom);
        }

        if (filters.ArrivedAtTo != null)
        {
            query = query.Where(bl => bl.ArrivedAt <= filters.ArrivedAtTo);
        }

        if (filters.DepartedAtFrom != null)
        {
            query = query.Where(bl => bl.DepartedAt >= filters.DepartedAtFrom);
        }

        if (filters.DepartedAtTo != null)
        {
            query = query.Where(bl => bl.DepartedAt <= filters.DepartedAtTo);
        }

        if (filters.IsCurrentLocation != null)
        {
            query = filters.IsCurrentLocation.Value
                ? query.Where(bl => bl.DepartedAt == null)
                : query.Where(bl => bl.DepartedAt != null);
        }

        return query;
    }

    private IQueryable<BatchLocation> GetAllFromDatabase()
    {
        return Db.BatchLocations.AsQueryable();
    }
}




