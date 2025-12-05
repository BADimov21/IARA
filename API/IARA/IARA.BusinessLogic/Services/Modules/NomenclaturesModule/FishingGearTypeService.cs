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

public class FishingGearTypeService : BaseService, IFishingGearTypeService
{
    public FishingGearTypeService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<FishingGearTypeResponseDTO> GetAll(BaseFilter<FishingGearTypeFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<FishingGearTypeResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(fgt => fgt.Id == id));
    }

    public int Add(FishingGearTypeCreateRequestDTO dto)
    {
        var fishingGearType = new FishingGearType
        {
            TypeName = dto.TypeName
        };

        Db.FishingGearTypes.Add(fishingGearType);
        Db.SaveChanges();

        return fishingGearType.Id;
    }

    public bool Edit(FishingGearTypeUpdateRequestDTO dto)
    {
        var fishingGearType = GetAllFromDatabase().Where(fgt => fgt.Id == dto.Id).Single();

        fishingGearType.TypeName = dto.TypeName;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.FishingGearTypes.Remove(GetAllFromDatabase().Where(fgt => fgt.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<FishingGearType> ApplyPagination(IQueryable<FishingGearType> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<FishingGearType> ApplyFreeTextSearch(IQueryable<FishingGearType> query, string text)
    {
        return query.Where(fgt => fgt.TypeName.Contains(text));
    }

    private IQueryable<FishingGearTypeResponseDTO> ApplyMapping(IQueryable<FishingGearType> query)
    {
        return query.Select(fgt => new FishingGearTypeResponseDTO
        {
            Id = fgt.Id,
            TypeName = fgt.TypeName
        });
    }

    private IQueryable<FishingGearType> ApplyFilters(IQueryable<FishingGearType> query, FishingGearTypeFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(fgt => fgt.Id == filters.Id);
        }

        if (!string.IsNullOrEmpty(filters.TypeName))
        {
            query = query.Where(fgt => fgt.TypeName.Contains(filters.TypeName));
        }

        return query;
    }

    private IQueryable<FishingGearType> GetAllFromDatabase()
    {
        return Db.FishingGearTypes.AsQueryable();
    }
}




