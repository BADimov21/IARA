using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.Common;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

public class FishBatchService : BaseService, IFishBatchService
{
    public FishBatchService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<FishBatchResponseDTO> GetAll(BaseFilter<FishBatchFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<FishBatchResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(b => b.Id == id));
    }

    public int Add(FishBatchCreateRequestDTO dto)
    {
        var batch = new FishBatch
        {
            BatchCode = dto.BatchCode,
            LandingId = dto.LandingId,
            SpeciesId = dto.SpeciesId,
            WeightKg = dto.WeightKg
        };

        Db.FishBatches.Add(batch);
        Db.SaveChanges();

        return batch.Id;
    }

    public bool Delete(int id)
    {
        Db.FishBatches.Remove(GetAllFromDatabase().Where(b => b.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<FishBatch> ApplyPagination(IQueryable<FishBatch> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<FishBatch> ApplyFreeTextSearch(IQueryable<FishBatch> query, string text)
    {
        return query.Where(b => b.BatchCode.Contains(text));
    }

    private IQueryable<FishBatchResponseDTO> ApplyMapping(IQueryable<FishBatch> query)
    {
        return (from batch in query
                join landing in Db.Landings on batch.LandingId equals landing.Id
                join species in Db.FishSpecies on batch.SpeciesId equals species.Id
                select new FishBatchResponseDTO
                {
                    Id = batch.Id,
                    BatchCode = batch.BatchCode,
                    WeightKg = batch.WeightKg,
                    Landing = new NomenclatureDTO
                    {
                        Id = landing.Id,
                        Name = $"Landing {landing.Port}"
                    },
                    Species = new NomenclatureDTO
                    {
                        Id = species.Id,
                        Name = species.SpeciesName
                    }
                });
    }

    private IQueryable<FishBatch> ApplyFilters(IQueryable<FishBatch> query, FishBatchFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(b => b.Id == filters.Id);
        }

        if (!string.IsNullOrEmpty(filters.BatchCode))
        {
            query = query.Where(b => b.BatchCode.Contains(filters.BatchCode));
        }

        if (filters.LandingId != null)
        {
            query = query.Where(b => b.LandingId == filters.LandingId);
        }

        if (filters.SpeciesId != null)
        {
            query = query.Where(b => b.SpeciesId == filters.SpeciesId);
        }

        if (filters.MinWeightKg != null)
        {
            query = query.Where(b => b.WeightKg >= filters.MinWeightKg);
        }

        if (filters.MaxWeightKg != null)
        {
            query = query.Where(b => b.WeightKg <= filters.MaxWeightKg);
        }

        return query;
    }

    private IQueryable<FishBatch> GetAllFromDatabase()
    {
        return Db.FishBatches.AsQueryable();
    }
}
