using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.Common;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

public class VesselService : BaseService, IVesselService
{
    public VesselService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<VesselResponseDTO> GetAll(BaseFilter<VesselFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<VesselResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(v => v.Id == id));
    }

    public int Add(VesselCreateRequestDTO dto)
    {
        var vessel = new Vessel
        {
            Name = dto.Name,
            CFR = dto.CFR,
            ExternalMark = dto.ExternalMark,
            RegistrationNumber = dto.RegistrationNumber,
            PortOfRegistration = dto.PortOfRegistration,
            Length = dto.Length,
            Width = dto.Width,
            GrossTonnage = dto.GrossTonnage,
            EnginePower = dto.EnginePower,
            EngineTypeId = dto.EngineTypeId,
            OwnerId = dto.OwnerId
        };

        Db.Vessels.Add(vessel);
        Db.SaveChanges();

        return vessel.Id;
    }

    public bool Edit(VesselUpdateRequestDTO dto)
    {
        var vessel = GetAllFromDatabase().Where(v => v.Id == dto.Id).Single();

        vessel.Name = dto.Name;
        vessel.PortOfRegistration = dto.PortOfRegistration;
        vessel.Length = dto.Length;
        vessel.Width = dto.Width;
        vessel.GrossTonnage = dto.GrossTonnage;
        vessel.EnginePower = dto.EnginePower;
        vessel.EngineTypeId = dto.EngineTypeId;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.Vessels.Remove(GetAllFromDatabase().Where(v => v.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<Vessel> ApplyPagination(IQueryable<Vessel> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<Vessel> ApplyFreeTextSearch(IQueryable<Vessel> query, string text)
    {
        return query.Where(v => v.Name.Contains(text) || v.CFR.Contains(text) || v.RegistrationNumber.Contains(text));
    }

    private IQueryable<VesselResponseDTO> ApplyMapping(IQueryable<Vessel> query)
    {
        return (from vessel in query
                join owner in Db.Persons on vessel.OwnerId equals owner.Id
                join engineType in Db.EngineTypes on vessel.EngineTypeId equals engineType.Id
                select new VesselResponseDTO
                {
                    Id = vessel.Id,
                    Name = vessel.Name,
                    CFR = vessel.CFR,
                    ExternalMark = vessel.ExternalMark,
                    RegistrationNumber = vessel.RegistrationNumber,
                    PortOfRegistration = vessel.PortOfRegistration,
                    Length = vessel.Length,
                    Width = vessel.Width,
                    GrossTonnage = vessel.GrossTonnage,
                    EnginePower = vessel.EnginePower,
                    Owner = new PersonSimpleResponseDTO
                    {
                        Id = owner.Id,
                        FirstName = owner.FirstName,
                        LastName = owner.LastName,
                        EGN = owner.EGN
                    },
                    EngineType = new NomenclatureDTO
                    {
                        Id = engineType.Id,
                        Name = engineType.TypeName
                    }
                });
    }

    private IQueryable<Vessel> ApplyFilters(IQueryable<Vessel> query, VesselFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(v => v.Id == filters.Id);
        }

        if (!string.IsNullOrEmpty(filters.Name))
        {
            query = query.Where(v => v.Name.Contains(filters.Name));
        }

        if (!string.IsNullOrEmpty(filters.CFR))
        {
            query = query.Where(v => v.CFR.Contains(filters.CFR));
        }

        if (!string.IsNullOrEmpty(filters.RegistrationNumber))
        {
            query = query.Where(v => v.RegistrationNumber.Contains(filters.RegistrationNumber));
        }

        if (filters.OwnerId != null)
        {
            query = query.Where(v => v.OwnerId == filters.OwnerId);
        }

        if (filters.MinLength != null)
        {
            query = query.Where(v => v.Length >= filters.MinLength);
        }

        if (filters.MaxLength != null)
        {
            query = query.Where(v => v.Length <= filters.MaxLength);
        }

        if (filters.MinWidth != null)
        {
            query = query.Where(v => v.Width >= filters.MinWidth);
        }

        if (filters.MaxWidth != null)
        {
            query = query.Where(v => v.Width <= filters.MaxWidth);
        }

        if (filters.MinEnginePower != null)
        {
            query = query.Where(v => v.EnginePower >= filters.MinEnginePower);
        }

        if (filters.MaxEnginePower != null)
        {
            query = query.Where(v => v.EnginePower <= filters.MaxEnginePower);
        }

        return query;
    }

    private IQueryable<Vessel> GetAllFromDatabase()
    {
        return Db.Vessels.AsQueryable();
    }
}
