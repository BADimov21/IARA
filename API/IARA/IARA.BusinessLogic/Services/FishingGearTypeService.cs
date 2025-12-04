using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

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
