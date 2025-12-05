using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.Common;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

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
        return ApplyMapping(ApplyPagination(GetAllFromDatabase(), filters.Page, filters.PageSize));
    }

    public IQueryable<CatchResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(c => c.Id == id));
    }

    public int Add(CatchCreateRequestDTO dto)
    {
        var catch_ = new Catch
        {
            OperationId = dto.OperationId,
            SpeciesId = dto.SpeciesId,
            Quantity = dto.Quantity,
            WeightKg = dto.WeightKg
        };

        Db.Catches.Add(catch_);
        Db.SaveChanges();

        return catch_.Id;
    }

    public bool Edit(CatchUpdateRequestDTO dto)
    {
        var catch_ = GetAllFromDatabase().Where(c => c.Id == dto.Id).Single();

        catch_.OperationId = dto.OperationId;
        catch_.SpeciesId = dto.SpeciesId;
        catch_.Quantity = dto.Quantity;
        catch_.WeightKg = dto.WeightKg;

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

    private IQueryable<CatchResponseDTO> ApplyMapping(IQueryable<Catch> query)
    {
        return (from catch_ in query
                join operation in Db.FishingOperations on catch_.OperationId equals operation.Id
                join species in Db.FishSpecies on catch_.SpeciesId equals species.Id
                select new CatchResponseDTO
                {
                    Id = catch_.Id,
                    Quantity = catch_.Quantity,
                    WeightKg = catch_.WeightKg,
                    Operation = new NomenclatureDTO
                    {
                        Id = operation.Id,
                        Name = $"Operation {operation.Id}"
                    },
                    Species = new NomenclatureDTO
                    {
                        Id = species.Id,
                        Name = species.SpeciesName
                    }
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

        if (filters.MinQuantity != null)
        {
            query = query.Where(c => c.Quantity >= filters.MinQuantity);
        }

        if (filters.MaxQuantity != null)
        {
            query = query.Where(c => c.Quantity <= filters.MaxQuantity);
        }

        if (filters.MinWeightKg != null)
        {
            query = query.Where(c => c.WeightKg >= filters.MinWeightKg);
        }

        if (filters.MaxWeightKg != null)
        {
            query = query.Where(c => c.WeightKg <= filters.MaxWeightKg);
        }

        return query;
    }

    private IQueryable<Catch> GetAllFromDatabase()
    {
        return Db.Catches.AsQueryable();
    }
}
