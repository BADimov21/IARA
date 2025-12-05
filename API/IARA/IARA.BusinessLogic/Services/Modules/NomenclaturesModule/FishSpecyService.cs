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

public class FishSpecyService : BaseService, IFishSpecyService
{
    public FishSpecyService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<FishSpecyResponseDTO> GetAll(BaseFilter<FishSpecyFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<FishSpecyResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(fs => fs.Id == id));
    }

    public int Add(FishSpecyCreateRequestDTO dto)
    {
        var fishSpecy = new FishSpecy
        {
            SpeciesName = dto.SpeciesName
        };

        Db.FishSpecies.Add(fishSpecy);
        Db.SaveChanges();

        return fishSpecy.Id;
    }

    public bool Edit(FishSpecyUpdateRequestDTO dto)
    {
        var fishSpecy = GetAllFromDatabase().Where(fs => fs.Id == dto.Id).Single();

        fishSpecy.SpeciesName = dto.SpeciesName;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.FishSpecies.Remove(GetAllFromDatabase().Where(fs => fs.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<FishSpecy> ApplyPagination(IQueryable<FishSpecy> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<FishSpecy> ApplyFreeTextSearch(IQueryable<FishSpecy> query, string text)
    {
        return query.Where(fs => fs.SpeciesName.Contains(text));
    }

    private IQueryable<FishSpecyResponseDTO> ApplyMapping(IQueryable<FishSpecy> query)
    {
        return query.Select(fs => new FishSpecyResponseDTO
        {
            Id = fs.Id,
            SpeciesName = fs.SpeciesName
        });
    }

    private IQueryable<FishSpecy> ApplyFilters(IQueryable<FishSpecy> query, FishSpecyFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(fs => fs.Id == filters.Id);
        }

        if (!string.IsNullOrEmpty(filters.SpeciesName))
        {
            query = query.Where(fs => fs.SpeciesName.Contains(filters.SpeciesName));
        }

        return query;
    }

    private IQueryable<FishSpecy> GetAllFromDatabase()
    {
        return Db.FishSpecies.AsQueryable();
    }
}




