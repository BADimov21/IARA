using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

public class EngineTypeService : BaseService, IEngineTypeService
{
    public EngineTypeService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<EngineTypeResponseDTO> GetAll(BaseFilter<EngineTypeFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<EngineTypeResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(et => et.Id == id));
    }

    public int Add(EngineTypeCreateRequestDTO dto)
    {
        var engineType = new EngineType
        {
            TypeName = dto.TypeName,
            FuelConsumption = dto.FuelConsumption
        };

        Db.EngineTypes.Add(engineType);
        Db.SaveChanges();

        return engineType.Id;
    }

    public bool Edit(EngineTypeUpdateRequestDTO dto)
    {
        var engineType = GetAllFromDatabase().Where(et => et.Id == dto.Id).Single();

        engineType.TypeName = dto.TypeName;
        engineType.FuelConsumption = dto.FuelConsumption;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.EngineTypes.Remove(GetAllFromDatabase().Where(et => et.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<EngineType> ApplyPagination(IQueryable<EngineType> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<EngineType> ApplyFreeTextSearch(IQueryable<EngineType> query, string text)
    {
        return query.Where(et => et.TypeName.Contains(text));
    }

    private IQueryable<EngineTypeResponseDTO> ApplyMapping(IQueryable<EngineType> query)
    {
        return query.Select(et => new EngineTypeResponseDTO
        {
            Id = et.Id,
            TypeName = et.TypeName,
            FuelConsumption = et.FuelConsumption
        });
    }

    private IQueryable<EngineType> ApplyFilters(IQueryable<EngineType> query, EngineTypeFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(et => et.Id == filters.Id);
        }

        if (!string.IsNullOrEmpty(filters.TypeName))
        {
            query = query.Where(et => et.TypeName.Contains(filters.TypeName));
        }

        if (filters.MinFuelConsumption != null)
        {
            query = query.Where(et => et.FuelConsumption >= filters.MinFuelConsumption);
        }

        if (filters.MaxFuelConsumption != null)
        {
            query = query.Where(et => et.FuelConsumption <= filters.MaxFuelConsumption);
        }

        return query;
    }

    private IQueryable<EngineType> GetAllFromDatabase()
    {
        return Db.EngineTypes.AsQueryable();
    }
}
