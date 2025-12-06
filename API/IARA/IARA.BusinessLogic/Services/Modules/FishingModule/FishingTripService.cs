using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.FishingModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.VesselsModule;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services.Modules.FishingModule;

public class FishingTripService : BaseService, IFishingTripService
{
    public FishingTripService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<FishingTripResponseDTO> GetAll(BaseFilter<FishingTripFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<FishingTripResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(t => t.Id == id));
    }

    public int Add(FishingTripCreateRequestDTO dto)
    {
        var trip = new FishingTrip
        {
            VesselId = dto.VesselId,
            PermitId = dto.PermitId,
            DepartureDateTime = dto.DepartureDateTime,
            DeparturePort = dto.DeparturePort
        };

        Db.FishingTrips.Add(trip);
        Db.SaveChanges();

        return trip.Id;
    }

    public bool Complete(FishingTripCompleteRequestDTO dto)
    {
        var trip = GetAllFromDatabase().Where(t => t.Id == dto.Id).Single();

        trip.ArrivalDateTime = dto.ArrivalDateTime;
        trip.ArrivalPort = dto.ArrivalPort;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.FishingTrips.Remove(GetAllFromDatabase().Where(t => t.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<FishingTrip> ApplyPagination(IQueryable<FishingTrip> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<FishingTrip> ApplyFreeTextSearch(IQueryable<FishingTrip> query, string text)
    {
        return query.Where(t => t.DeparturePort.Contains(text) || 
                                (t.ArrivalPort != null && t.ArrivalPort.Contains(text)) ||
                                t.Vessel.VesselName.Contains(text));
    }

    private IQueryable<FishingTripResponseDTO> ApplyMapping(IQueryable<FishingTrip> query)
    {
        return (from trip in query
                join vessel in Db.Vessels on trip.VesselId equals vessel.Id
                join permit in Db.FishingPermits on trip.PermitId equals permit.Id
                select new FishingTripResponseDTO
                {
                    Id = trip.Id,
                    VesselId = vessel.Id,
                    Vessel = new VesselSimpleResponseDTO
                    {
                        Id = vessel.Id,
                        InternationalNumber = vessel.InternationalNumber,
                        VesselName = vessel.VesselName
                    },
                    PermitId = permit.Id,
                    Permit = new FishingPermitSimpleResponseDTO
                    {
                        Id = permit.Id,
                        PermitNumber = permit.PermitNumber
                    },
                    DepartureDateTime = trip.DepartureDateTime,
                    DeparturePort = trip.DeparturePort,
                    ArrivalDateTime = trip.ArrivalDateTime,
                    ArrivalPort = trip.ArrivalPort,
                    DurationHours = trip.DurationHours
                });
    }

    private IQueryable<FishingTrip> ApplyFilters(IQueryable<FishingTrip> query, FishingTripFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(t => t.Id == filters.Id);
        }

        if (filters.VesselId != null)
        {
            query = query.Where(t => t.VesselId == filters.VesselId);
        }

        if (filters.PermitId != null)
        {
            query = query.Where(t => t.PermitId == filters.PermitId);
        }

        if (filters.DepartureDateFrom != null)
        {
            query = query.Where(t => t.DepartureDateTime >= filters.DepartureDateFrom);
        }

        if (filters.DepartureDateTo != null)
        {
            query = query.Where(t => t.DepartureDateTime <= filters.DepartureDateTo);
        }

        if (!string.IsNullOrEmpty(filters.DeparturePort))
        {
            query = query.Where(t => t.DeparturePort.Contains(filters.DeparturePort));
        }

        if (filters.ArrivalDateFrom != null)
        {
            query = query.Where(t => t.ArrivalDateTime >= filters.ArrivalDateFrom);
        }

        if (filters.ArrivalDateTo != null)
        {
            query = query.Where(t => t.ArrivalDateTime <= filters.ArrivalDateTo);
        }

        if (!string.IsNullOrEmpty(filters.ArrivalPort))
        {
            query = query.Where(t => t.ArrivalPort != null && t.ArrivalPort.Contains(filters.ArrivalPort));
        }

        if (filters.IsCompleted != null)
        {
            if (filters.IsCompleted == true)
            {
                query = query.Where(t => t.ArrivalDateTime != null);
            }
            else
            {
                query = query.Where(t => t.ArrivalDateTime == null);
            }
        }

        return query;
    }

    private IQueryable<FishingTrip> GetAllFromDatabase()
    {
        return Db.FishingTrips.AsQueryable();
    }
}
