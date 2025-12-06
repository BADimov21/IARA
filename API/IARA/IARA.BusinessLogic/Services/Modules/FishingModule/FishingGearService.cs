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
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<FishingGearResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(g => g.Id == id));
    }

    public int Add(FishingGearCreateRequestDTO dto)
    {
        var gear = new FishingGear
        {
            GearTypeId = dto.GearTypeId,
            MeshSize = dto.MeshSize.HasValue ? (int?)dto.MeshSize.Value : null,
            Length = dto.Length
        };

        Db.FishingGears.Add(gear);
        Db.SaveChanges();

        return gear.Id;
    }

    public bool Edit(FishingGearUpdateRequestDTO dto)
    {
        var gear = GetAllFromDatabase().Where(g => g.Id == dto.Id).Single();

        if (dto.GearTypeId.HasValue)
        {
            gear.GearTypeId = dto.GearTypeId.Value;
        }
        gear.MeshSize = dto.MeshSize;
        gear.Length = dto.Length;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.FishingGears.Remove(GetAllFromDatabase().Where(g => g.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<FishingGear> ApplyPagination(IQueryable<FishingGear> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<FishingGear> ApplyFreeTextSearch(IQueryable<FishingGear> query, string text)
    {
        return query.Where(g => g.GearType.TypeName.Contains(text));
    }

    private IQueryable<FishingGearResponseDTO> ApplyMapping(IQueryable<FishingGear> query)
    {
        return (from gear in query
                join gearType in Db.FishingGearTypes on gear.GearTypeId equals gearType.Id
                select new FishingGearResponseDTO
                {
                    Id = gear.Id,
                    GearTypeId = gearType.Id,
                    GearType = new NomenclatureDTO
                    {
                        Id = gearType.Id,
                        Name = gearType.TypeName
                    },
                    MeshSize = gear.MeshSize,
                    Length = gear.Length
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
            query = query.Where(g => g.Id == filters.Id);
        }

        if (filters.GearTypeId != null)
        {
            query = query.Where(g => g.GearTypeId == filters.GearTypeId);
        }

        if (filters.MinMeshSize != null)
        {
            query = query.Where(g => g.MeshSize >= filters.MinMeshSize);
        }

        if (filters.MaxMeshSize != null)
        {
            query = query.Where(g => g.MeshSize <= filters.MaxMeshSize);
        }

        if (filters.MinLength != null)
        {
            query = query.Where(g => g.Length >= filters.MinLength);
        }

        if (filters.MaxLength != null)
        {
            query = query.Where(g => g.Length <= filters.MaxLength);
        }

        return query;
    }

    private IQueryable<FishingGear> GetAllFromDatabase()
    {
        return Db.FishingGears.AsQueryable();
    }
}
