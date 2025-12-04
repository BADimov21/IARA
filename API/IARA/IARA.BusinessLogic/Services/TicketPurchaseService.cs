using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.Common;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

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
            PersonId = dto.PersonId,
            TicketTypeId = dto.TicketTypeId,
            PurchaseDateTime = dto.PurchaseDateTime,
            ValidFrom = dto.ValidFrom,
            ValidTo = dto.ValidTo,
            Price = dto.Price
        };

        Db.TicketPurchases.Add(ticketPurchase);
        Db.SaveChanges();

        return ticketPurchase.Id;
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
                    PurchaseDateTime = purchase.PurchaseDateTime,
                    ValidFrom = purchase.ValidFrom,
                    ValidTo = purchase.ValidTo,
                    Price = purchase.Price,
                    Person = new PersonSimpleResponseDTO
                    {
                        Id = person.Id,
                        FirstName = person.FirstName,
                        LastName = person.LastName,
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

        if (filters.PurchaseDateTimeFrom != null)
        {
            query = query.Where(tp => tp.PurchaseDateTime >= filters.PurchaseDateTimeFrom);
        }

        if (filters.PurchaseDateTimeTo != null)
        {
            query = query.Where(tp => tp.PurchaseDateTime <= filters.PurchaseDateTimeTo);
        }

        if (filters.ValidFrom != null)
        {
            query = query.Where(tp => tp.ValidFrom >= filters.ValidFrom);
        }

        if (filters.ValidTo != null)
        {
            query = query.Where(tp => tp.ValidTo <= filters.ValidTo);
        }

        if (filters.IsActive != null)
        {
            var now = DateTime.Now;
            query = filters.IsActive.Value
                ? query.Where(tp => tp.ValidFrom <= now && tp.ValidTo >= now)
                : query.Where(tp => tp.ValidTo < now);
        }

        return query;
    }

    private IQueryable<TicketPurchase> GetAllFromDatabase()
    {
        return Db.TicketPurchases.AsQueryable();
    }
}
