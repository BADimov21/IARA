using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.Common;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

public class FishingGearService : BaseService, IFishingGearService
{
    public FishingGearService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<FishingGearResponseDTO> GetAll(BaseFilter<FishingGearFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(GetAllFromDatabase(), filters.Page, filters.PageSize));
    }

    public IQueryable<FishingGearResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(fg => fg.Id == id));
    }

    public int Add(FishingGearCreateRequestDTO dto)
    {
        var fishingGear = new FishingGear
        {
            GearTypeId = dto.GearTypeId,
            Length = dto.Length,
            MeshSize = dto.MeshSize
        };

        Db.FishingGears.Add(fishingGear);
        Db.SaveChanges();

        return fishingGear.Id;
    }

    public bool Edit(FishingGearUpdateRequestDTO dto)
    {
        var fishingGear = GetAllFromDatabase().Where(fg => fg.Id == dto.Id).Single();

        if (dto.GearTypeId != null) fishingGear.GearTypeId = dto.GearTypeId.Value;
        if (dto.Length != null) fishingGear.Length = dto.Length;
        if (dto.MeshSize != null) fishingGear.MeshSize = dto.MeshSize;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.FishingGears.Remove(GetAllFromDatabase().Where(fg => fg.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<FishingGear> ApplyPagination(IQueryable<FishingGear> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<FishingGearResponseDTO> ApplyMapping(IQueryable<FishingGear> query)
    {
        return (from gear in query
                join gearType in Db.FishingGearTypes on gear.GearTypeId equals gearType.Id
                select new FishingGearResponseDTO
                {
                    Id = gear.Id,
                    Length = gear.Length,
                    MeshSize = gear.MeshSize,
                    GearTypeId = gear.GearTypeId,
                    GearType = new NomenclatureDTO
                    {
                        Id = gearType.Id,
                        Name = gearType.TypeName
                    }
                });
    }

    private IQueryable<FishingGear> ApplyFilters(IQueryable<FishingGear> query, FishingGearFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(fg => fg.Id == filters.Id);
        }

        if (filters.GearTypeId != null)
        {
            query = query.Where(fg => fg.GearTypeId == filters.GearTypeId);
        }

        if (filters.MinLength != null)
        {
            query = query.Where(fg => fg.Length >= filters.MinLength);
        }

        if (filters.MaxLength != null)
        {
            query = query.Where(fg => fg.Length <= filters.MaxLength);
        }

        if (filters.MinMeshSize != null)
        {
            query = query.Where(fg => fg.MeshSize >= filters.MinMeshSize);
        }

        if (filters.MaxMeshSize != null)
        {
            query = query.Where(fg => fg.MeshSize <= filters.MaxMeshSize);
        }

        return query;
    }

    private IQueryable<FishingGear> GetAllFromDatabase()
    {
        return Db.FishingGears.AsQueryable();
    }
}
