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

public class TicketPurchaseService : BaseService, ITicketPurchaseService
{
    public TicketPurchaseService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<TicketPurchaseResponseDTO> GetAll(BaseFilter<TicketPurchaseFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(GetAllFromDatabase(), filters.Page, filters.PageSize));
    }

    public IQueryable<TicketPurchaseResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(tp => tp.Id == id));
    }

    public int Add(TicketPurchaseCreateRequestDTO dto)
    {
        var ticketPurchase = new TicketPurchase
        {
            TicketNumber = GenerateTicketNumber(),
            PersonId = dto.PersonId,
            TicketTypeId = dto.TicketTypeId,
            PurchaseDate = dto.PurchaseDate,
            ValidFrom = dto.ValidFrom,
            ValidUntil = dto.ValidUntil,
            PricePaid = dto.PricePaid,
            TELKDecisionId = dto.TELKDecisionId
        };

        Db.TicketPurchases.Add(ticketPurchase);
        Db.SaveChanges();

        return ticketPurchase.Id;
    }
    
    private string GenerateTicketNumber()
    {
        var lastTicket = Db.TicketPurchases
            .OrderByDescending(tp => tp.Id)
            .FirstOrDefault();
            
        int nextNumber = (lastTicket?.Id ?? 0) + 1;
        return $"TKT{DateTime.Now.Year}{nextNumber:D6}";
    }

    public bool Delete(int id)
    {
        Db.TicketPurchases.Remove(GetAllFromDatabase().Where(tp => tp.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<TicketPurchase> ApplyPagination(IQueryable<TicketPurchase> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<TicketPurchaseResponseDTO> ApplyMapping(IQueryable<TicketPurchase> query)
    {
        return (from purchase in query
                join person in Db.Persons on purchase.PersonId equals person.Id
                join ticketType in Db.TicketTypes on purchase.TicketTypeId equals ticketType.Id
                select new TicketPurchaseResponseDTO
                {
                    Id = purchase.Id,
                    TicketNumber = purchase.TicketNumber,
                    PurchaseDate = purchase.PurchaseDate,
                    ValidFrom = purchase.ValidFrom,
                    ValidUntil = purchase.ValidUntil,
                    PricePaid = purchase.PricePaid,
                    PersonId = purchase.PersonId,
                    TicketTypeId = purchase.TicketTypeId,
                    Person = new PersonSimpleResponseDTO
                    {
                        Id = person.Id,
                        FullName = person.FirstName + " " + person.LastName,
                        EGN = person.EGN
                    },
                    TicketType = new NomenclatureDTO
                    {
                        Id = ticketType.Id,
                        Name = ticketType.TypeName
                    }
                });
    }

    private IQueryable<TicketPurchase> ApplyFilters(IQueryable<TicketPurchase> query, TicketPurchaseFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(tp => tp.Id == filters.Id);
        }

        if (filters.PersonId != null)
        {
            query = query.Where(tp => tp.PersonId == filters.PersonId);
        }

        if (filters.TicketTypeId != null)
        {
            query = query.Where(tp => tp.TicketTypeId == filters.TicketTypeId);
        }

        if (filters.PurchaseDateFrom != null)
        {
            query = query.Where(tp => tp.PurchaseDate >= filters.PurchaseDateFrom);
        }

        if (filters.PurchaseDateTo != null)
        {
            query = query.Where(tp => tp.PurchaseDate <= filters.PurchaseDateTo);
        }

        if (filters.ValidFromDate != null)
        {
            query = query.Where(tp => tp.ValidFrom >= filters.ValidFromDate);
        }

        if (filters.ValidUntilDate != null)
        {
            query = query.Where(tp => tp.ValidUntil <= filters.ValidUntilDate);
        }

        return query;
    }

    private IQueryable<TicketPurchase> GetAllFromDatabase()
    {
        return Db.TicketPurchases.AsQueryable();
    }
}




