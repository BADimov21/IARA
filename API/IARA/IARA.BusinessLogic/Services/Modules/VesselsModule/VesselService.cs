using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.Common;
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

namespace IARA.BusinessLogic.Services.Modules.VesselsModule;

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
            InternationalNumber = dto.InternationalNumber,
            CallSign = dto.CallSign,
            VesselName = dto.VesselName,
            Length = dto.Length,
            Width = dto.Width,
            GrossTonnage = dto.GrossTonnage,
            EnginePower = dto.EnginePower,
            EngineTypeId = dto.EngineTypeId,
            OwnerId = dto.OwnerId,
            CaptainId = dto.CaptainId
        };

        Db.Vessels.Add(vessel);
        Db.SaveChanges();

        return vessel.Id;
    }

    public bool Edit(VesselUpdateRequestDTO dto)
    {
        var vessel = GetAllFromDatabase().Where(v => v.Id == dto.Id).Single();

        if (dto.CallSign != null) vessel.CallSign = dto.CallSign;
        if (dto.VesselName != null) vessel.VesselName = dto.VesselName;
        if (dto.Length != null) vessel.Length = dto.Length.Value;
        if (dto.Width != null) vessel.Width = dto.Width.Value;
        if (dto.GrossTonnage != null) vessel.GrossTonnage = dto.GrossTonnage.Value;
        if (dto.EnginePower != null) vessel.EnginePower = dto.EnginePower.Value;
        if (dto.EngineTypeId != null) vessel.EngineTypeId = dto.EngineTypeId.Value;
        if (dto.OwnerId != null) vessel.OwnerId = dto.OwnerId.Value;
        if (dto.CaptainId != null) vessel.CaptainId = dto.CaptainId.Value;

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
        return query.Where(v => v.VesselName.Contains(text) || v.InternationalNumber.Contains(text) || v.CallSign.Contains(text));
    }

    private IQueryable<VesselResponseDTO> ApplyMapping(IQueryable<Vessel> query)
    {
        return (from vessel in query
                join owner in Db.Persons on vessel.OwnerId equals owner.Id
                join captain in Db.Persons on vessel.CaptainId equals captain.Id
                join engineType in Db.EngineTypes on vessel.EngineTypeId equals engineType.Id
                select new VesselResponseDTO
                {
                    Id = vessel.Id,
                    InternationalNumber = vessel.InternationalNumber,
                    CallSign = vessel.CallSign,
                    VesselName = vessel.VesselName,
                    Length = vessel.Length,
                    Width = vessel.Width,
                    GrossTonnage = vessel.GrossTonnage,
                    EnginePower = vessel.EnginePower,
                    EngineTypeId = vessel.EngineTypeId,
                    Owner = new PersonSimpleResponseDTO
                    {
                        Id = owner.Id,
                        FullName = owner.FirstName + " " + owner.LastName,
                        EGN = owner.EGN
                    },
                    OwnerId = vessel.OwnerId,
                    Captain = new PersonSimpleResponseDTO
                    {
                        Id = captain.Id,
                        FullName = captain.FirstName + " " + captain.LastName,
                        EGN = captain.EGN
                    },
                    CaptainId = vessel.CaptainId,
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

        if (!string.IsNullOrEmpty(filters.VesselName))
        {
            query = query.Where(v => v.VesselName.Contains(filters.VesselName));
        }

        if (!string.IsNullOrEmpty(filters.InternationalNumber))
        {
            query = query.Where(v => v.InternationalNumber.Contains(filters.InternationalNumber));
        }

        if (!string.IsNullOrEmpty(filters.CallSign))
        {
            query = query.Where(v => v.CallSign.Contains(filters.CallSign));
        }

        if (filters.OwnerId != null)
        {
            query = query.Where(v => v.OwnerId == filters.OwnerId);
        }

        if (filters.CaptainId != null)
        {
            query = query.Where(v => v.CaptainId == filters.CaptainId);
        }

        if (filters.EngineTypeId != null)
        {
            query = query.Where(v => v.EngineTypeId == filters.EngineTypeId);
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




