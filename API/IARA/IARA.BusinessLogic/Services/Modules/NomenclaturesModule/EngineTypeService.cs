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

namespace IARA.BusinessLogic.Services.Modules.NomenclaturesModule;

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
            AverageFuelConsumption = dto.AverageFuelConsumption,
            FuelUnit = dto.FuelUnit
        };

        Db.EngineTypes.Add(engineType);
        Db.SaveChanges();

        return engineType.Id;
    }

    public bool Edit(EngineTypeUpdateRequestDTO dto)
    {
        var engineType = GetAllFromDatabase().Where(et => et.Id == dto.Id).Single();

        if (dto.TypeName != null) engineType.TypeName = dto.TypeName;
        if (dto.AverageFuelConsumption != null) engineType.AverageFuelConsumption = dto.AverageFuelConsumption.Value;
        if (dto.FuelUnit != null) engineType.FuelUnit = dto.FuelUnit;

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
            AverageFuelConsumption = et.AverageFuelConsumption,
            FuelUnit = et.FuelUnit
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

        if (filters.MinAverageFuelConsumption != null)
        {
            query = query.Where(et => et.AverageFuelConsumption >= filters.MinAverageFuelConsumption);
        }

        if (filters.MaxAverageFuelConsumption != null)
        {
            query = query.Where(et => et.AverageFuelConsumption <= filters.MaxAverageFuelConsumption);
        }

        if (!string.IsNullOrEmpty(filters.FuelUnit))
        {
            query = query.Where(et => et.FuelUnit == filters.FuelUnit);
        }

        return query;
    }

    private IQueryable<EngineType> GetAllFromDatabase()
    {
        return Db.EngineTypes.AsQueryable();
    }
}




