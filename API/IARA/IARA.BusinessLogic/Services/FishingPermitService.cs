using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.Common;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

public class FishingPermitService : BaseService, IFishingPermitService
{
    public FishingPermitService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<FishingPermitResponseDTO> GetAll(BaseFilter<FishingPermitFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<FishingPermitResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(p => p.Id == id));
    }

    public int Add(FishingPermitCreateRequestDTO dto)
    {
        var permit = new FishingPermit
        {
            PermitNumber = dto.PermitNumber,
            VesselId = dto.VesselId,
            IssueDate = dto.IssueDate,
            ValidFrom = dto.ValidFrom,
            ValidUntil = dto.ValidUntil,
            IsRevoked = false
        };

        Db.FishingPermits.Add(permit);
        Db.SaveChanges();

        return permit.Id;
    }

    public bool Revoke(FishingPermitRevokeRequestDTO dto)
    {
        var permit = GetAllFromDatabase().Where(p => p.Id == dto.Id).Single();

        permit.IsRevoked = true;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.FishingPermits.Remove(GetAllFromDatabase().Where(p => p.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<FishingPermit> ApplyPagination(IQueryable<FishingPermit> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<FishingPermit> ApplyFreeTextSearch(IQueryable<FishingPermit> query, string text)
    {
        return query.Where(p => p.PermitNumber.Contains(text));
    }

    private IQueryable<FishingPermitResponseDTO> ApplyMapping(IQueryable<FishingPermit> query)
    {
        return (from permit in query
                join vessel in Db.Vessels on permit.VesselId equals vessel.Id
                select new FishingPermitResponseDTO
                {
                    Id = permit.Id,
                    PermitNumber = permit.PermitNumber,
                    IssueDate = permit.IssueDate,
                    ValidFrom = permit.ValidFrom,
                    ValidUntil = permit.ValidUntil,
                    IsRevoked = permit.IsRevoked,
                    VesselId = vessel.Id,
                    Vessel = new VesselSimpleResponseDTO
                    {
                        Id = vessel.Id,
                        InternationalNumber = vessel.InternationalNumber,
                        VesselName = vessel.VesselName
                    },
                    FishingGears = new List<FishingGearResponseDTO>() // Will be populated separately if needed
                });
    }

    private IQueryable<FishingPermit> ApplyFilters(IQueryable<FishingPermit> query, FishingPermitFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(p => p.Id == filters.Id);
        }

        if (!string.IsNullOrEmpty(filters.PermitNumber))
        {
            query = query.Where(p => p.PermitNumber.Contains(filters.PermitNumber));
        }

        if (filters.VesselId != null)
        {
            query = query.Where(p => p.VesselId == filters.VesselId);
        }

        if (filters.IssueDateFrom != null)
        {
            query = query.Where(p => p.IssueDate >= filters.IssueDateFrom);
        }

        if (filters.IssueDateTo != null)
        {
            query = query.Where(p => p.IssueDate <= filters.IssueDateTo);
        }

        if (filters.ValidFromDate != null)
        {
            query = query.Where(p => p.ValidFrom >= filters.ValidFromDate);
        }

        if (filters.ValidUntilDate != null)
        {
            query = query.Where(p => p.ValidUntil <= filters.ValidUntilDate);
        }

        if (filters.IsRevoked != null)
        {
            query = query.Where(p => p.IsRevoked == filters.IsRevoked);
        }

        return query;
    }

    private IQueryable<FishingPermit> GetAllFromDatabase()
    {
        return Db.FishingPermits.AsQueryable();
    }
}
