using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.FishingModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.NomenclaturesModule;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services.Modules.FishingModule;

public class CatchService : BaseService, ICatchService
{
    public CatchService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<CatchResponseDTO> GetAll(BaseFilter<CatchFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<CatchResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(c => c.Id == id));
    }

    public int Add(CatchCreateRequestDTO dto)
    {
        var catchEntity = new Catch
        {
            OperationId = dto.OperationId,
            SpeciesId = dto.SpeciesId,
            Quantity = dto.Quantity,
            WeightKg = dto.WeightKg
        };

        Db.Catches.Add(catchEntity);
        Db.SaveChanges();

        return catchEntity.Id;
    }

    public bool Edit(CatchUpdateRequestDTO dto)
    {
        var catchEntity = GetAllFromDatabase().Where(c => c.Id == dto.Id).Single();

        catchEntity.OperationId = dto.OperationId;
        catchEntity.SpeciesId = dto.SpeciesId;
        catchEntity.Quantity = dto.Quantity;
        catchEntity.WeightKg = dto.WeightKg;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.Catches.Remove(GetAllFromDatabase().Where(c => c.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<Catch> ApplyPagination(IQueryable<Catch> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<Catch> ApplyFreeTextSearch(IQueryable<Catch> query, string text)
    {
        return query.Where(c => c.Species.SpeciesName.Contains(text));
    }

    private IQueryable<CatchResponseDTO> ApplyMapping(IQueryable<Catch> query)
    {
        return (from catchEntity in query
                join operation in Db.FishingOperations on catchEntity.OperationId equals operation.Id
                join species in Db.FishSpecies on catchEntity.SpeciesId equals species.Id
                select new CatchResponseDTO
                {
                    Id = catchEntity.Id,
                    OperationId = operation.Id,
                    SpeciesId = species.Id,
                    Species = new FishSpecyResponseDTO
                    {
                        Id = species.Id,
                        SpeciesName = species.SpeciesName
                    },
                    Quantity = catchEntity.Quantity,
                    WeightKg = catchEntity.WeightKg
                });
    }

    private IQueryable<Catch> ApplyFilters(IQueryable<Catch> query, CatchFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(c => c.Id == filters.Id);
        }

        if (filters.OperationId != null)
        {
            query = query.Where(c => c.OperationId == filters.OperationId);
        }

        if (filters.SpeciesId != null)
        {
            query = query.Where(c => c.SpeciesId == filters.SpeciesId);
        }

        if (filters.QuantityMin != null)
        {
            query = query.Where(c => c.Quantity >= filters.QuantityMin);
        }

        if (filters.QuantityMax != null)
        {
            query = query.Where(c => c.Quantity <= filters.QuantityMax);
        }

        if (filters.WeightKgMin != null)
        {
            query = query.Where(c => c.WeightKg >= filters.WeightKgMin);
        }

        if (filters.WeightKgMax != null)
        {
            query = query.Where(c => c.WeightKg <= filters.WeightKgMax);
        }

        return query;
    }

    private IQueryable<Catch> GetAllFromDatabase()
    {
        return Db.Catches.AsQueryable();
    }
}
