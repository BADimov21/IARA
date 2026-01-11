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

namespace IARA.BusinessLogic.Services.Modules.TicketsModule;

public class RecreationalCatchService : BaseService, IRecreationalCatchService
{
    public RecreationalCatchService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<RecreationalCatchResponseDTO> GetAll(BaseFilter<RecreationalCatchFilter> filters, string? userId, bool isAdmin)
    {
        var query = GetAllFromDatabase();
        
        // Filter by user's PersonId for non-admin users
        if (!isAdmin && !string.IsNullOrEmpty(userId))
        {
            var user = Db.Users.FirstOrDefault(u => u.Id == userId);
            if (user?.PersonId != null)
            {
                // Filter catches by ticket purchases that belong to this person
                var userTicketIds = Db.TicketPurchases
                    .Where(tp => tp.PersonId == user.PersonId.Value)
                    .Select(tp => tp.Id)
                    .ToList();
                query = query.Where(rc => userTicketIds.Contains(rc.TicketPurchaseId));
            }
            else
            {
                // User has no PersonId, return empty result
                return Enumerable.Empty<RecreationalCatchResponseDTO>().AsQueryable();
            }
        }
        
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(query, filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(query, filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<RecreationalCatchResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(rc => rc.Id == id));
    }

    public int Add(RecreationalCatchCreateRequestDTO dto)
    {
        var recreationalCatch = new RecreationalCatch
        {
            TicketPurchaseId = dto.TicketPurchaseId,
            PersonId = dto.PersonId,
            SpeciesId = dto.SpeciesId,
            CatchDateTime = dto.CatchDateTime,
            Location = dto.Location,
            Quantity = dto.Quantity,
            WeightKg = dto.WeightKg
        };

        Db.RecreationalCatches.Add(recreationalCatch);
        Db.SaveChanges();

        return recreationalCatch.Id;
    }

    public bool Edit(RecreationalCatchUpdateRequestDTO dto)
    {
        var recreationalCatch = GetAllFromDatabase().Where(rc => rc.Id == dto.Id).Single();

        recreationalCatch.TicketPurchaseId = dto.TicketPurchaseId;
        recreationalCatch.PersonId = dto.PersonId;
        recreationalCatch.SpeciesId = dto.SpeciesId;
        recreationalCatch.CatchDateTime = dto.CatchDateTime;
        recreationalCatch.Location = dto.Location;
        recreationalCatch.Quantity = dto.Quantity;
        recreationalCatch.WeightKg = dto.WeightKg;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.RecreationalCatches.Remove(GetAllFromDatabase().Where(rc => rc.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<RecreationalCatch> ApplyPagination(IQueryable<RecreationalCatch> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<RecreationalCatch> ApplyFreeTextSearch(IQueryable<RecreationalCatch> query, string text)
    {
        return query.Where(rc => rc.Location != null && rc.Location.Contains(text));
    }

    private IQueryable<RecreationalCatchResponseDTO> ApplyMapping(IQueryable<RecreationalCatch> query)
    {
        return (from recreationalCatch in query
                join person in Db.Persons on recreationalCatch.PersonId equals person.Id
                join species in Db.FishSpecies on recreationalCatch.SpeciesId equals species.Id
                select new RecreationalCatchResponseDTO
                {
                    Id = recreationalCatch.Id,
                    CatchDateTime = recreationalCatch.CatchDateTime,
                    Location = recreationalCatch.Location,
                    Quantity = recreationalCatch.Quantity,
                    WeightKg = recreationalCatch.WeightKg,
                    TicketPurchaseId = recreationalCatch.TicketPurchaseId,
                    SpeciesId = recreationalCatch.SpeciesId,
                    PersonId = recreationalCatch.PersonId,
                    Person = new PersonSimpleResponseDTO
                    {
                        Id = person.Id,
                        FullName = person.FirstName + " " + person.LastName,
                        EGN = person.EGN
                    },
                    Species = new NomenclatureDTO
                    {
                        Id = species.Id,
                        Name = species.SpeciesName
                    }
                });
    }

    private IQueryable<RecreationalCatch> ApplyFilters(IQueryable<RecreationalCatch> query, RecreationalCatchFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(rc => rc.Id == filters.Id);
        }

        if (filters.TicketPurchaseId != null)
        {
            query = query.Where(rc => rc.TicketPurchaseId == filters.TicketPurchaseId);
        }

        if (filters.SpeciesId != null)
        {
            query = query.Where(rc => rc.SpeciesId == filters.SpeciesId);
        }

        if (filters.CatchDateTimeFrom != null)
        {
            query = query.Where(rc => rc.CatchDateTime >= filters.CatchDateTimeFrom);
        }

        if (filters.CatchDateTimeTo != null)
        {
            query = query.Where(rc => rc.CatchDateTime <= filters.CatchDateTimeTo);
        }

        if (!string.IsNullOrEmpty(filters.Location))
        {
            query = query.Where(rc => rc.Location != null && rc.Location.Contains(filters.Location));
        }

        if (filters.MinQuantity != null)
        {
            query = query.Where(rc => rc.Quantity >= filters.MinQuantity);
        }

        if (filters.MaxQuantity != null)
        {
            query = query.Where(rc => rc.Quantity <= filters.MaxQuantity);
        }

        if (filters.MinWeightKg != null)
        {
            query = query.Where(rc => rc.WeightKg >= filters.MinWeightKg);
        }

        if (filters.MaxWeightKg != null)
        {
            query = query.Where(rc => rc.WeightKg <= filters.MaxWeightKg);
        }

        return query;
    }

    private IQueryable<RecreationalCatch> GetAllFromDatabase()
    {
        return Db.RecreationalCatches.AsQueryable();
    }
}




