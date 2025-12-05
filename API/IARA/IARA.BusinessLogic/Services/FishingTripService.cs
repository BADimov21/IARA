using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

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
        return query.Where(t => t.DeparturePort.Contains(text) || (t.ArrivalPort != null && t.ArrivalPort.Contains(text)));
    }

    private IQueryable<FishingTripResponseDTO> ApplyMapping(IQueryable<FishingTrip> query)
    {
        return (from trip in query
                join permit in Db.FishingPermits on trip.PermitId equals permit.Id
                join vessel in Db.Vessels on permit.VesselId equals vessel.Id
                join owner in Db.Persons on vessel.OwnerId equals owner.Id
                select new FishingTripResponseDTO
                {
                    Id = trip.Id,
                    DepartureDateTime = trip.DepartureDateTime,
                    ArrivalDateTime = trip.ArrivalDateTime,
                    DeparturePort = trip.DeparturePort,
                    ArrivalPort = trip.ArrivalPort,
                    Permit = new FishingPermitSimpleResponseDTO
                    {
                        Id = permit.Id,
                        PermitNumber = permit.PermitNumber,
                        ValidFrom = permit.ValidFrom,
                        ValidTo = permit.ValidTo,
                        Vessel = new VesselSimpleResponseDTO
                        {
                            Id = vessel.Id,
                            Name = vessel.Name,
                            CFR = vessel.CFR,
                            RegistrationNumber = vessel.RegistrationNumber,
                            Owner = new PersonSimpleResponseDTO
                            {
                                Id = owner.Id,
                                FirstName = owner.FirstName,
                                LastName = owner.LastName,
                                EGN = owner.EGN
                            }
                        }
                    }
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

        if (filters.PermitId != null)
        {
            query = query.Where(t => t.PermitId == filters.PermitId);
        }

        if (filters.DepartureDateTimeFrom != null)
        {
            query = query.Where(t => t.DepartureDateTime >= filters.DepartureDateTimeFrom);
        }

        if (filters.DepartureDateTimeTo != null)
        {
            query = query.Where(t => t.DepartureDateTime <= filters.DepartureDateTimeTo);
        }

        if (filters.ArrivalDateTimeFrom != null)
        {
            query = query.Where(t => t.ArrivalDateTime >= filters.ArrivalDateTimeFrom);
        }

        if (filters.ArrivalDateTimeTo != null)
        {
            query = query.Where(t => t.ArrivalDateTime <= filters.ArrivalDateTimeTo);
        }

        if (filters.IsCompleted != null)
        {
            query = filters.IsCompleted.Value
                ? query.Where(t => t.ArrivalDateTime != null)
                : query.Where(t => t.ArrivalDateTime == null);
        }

        return query;
    }

    private IQueryable<FishingTrip> GetAllFromDatabase()
    {
        return Db.FishingTrips.AsQueryable();
    }
}
