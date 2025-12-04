using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

public class TicketTypeService : BaseService, ITicketTypeService
{
    public TicketTypeService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<TicketTypeResponseDTO> GetAll(BaseFilter<TicketTypeFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<TicketTypeResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(t => t.Id == id));
    }

    public int Add(TicketTypeCreateRequestDTO dto)
    {
        var ticketType = new TicketType
        {
            TypeName = dto.TypeName,
            ValidityDays = dto.ValidityDays,
            Price = dto.Price,
            IsFreeForDisabled = dto.IsFreeForDisabled
        };

        Db.TicketTypes.Add(ticketType);
        Db.SaveChanges();

        return ticketType.Id;
    }

    public bool Edit(TicketTypeUpdateRequestDTO dto)
    {
        var ticketType = GetAllFromDatabase().Where(t => t.Id == dto.Id).Single();

        ticketType.TypeName = dto.TypeName;
        ticketType.ValidityDays = dto.ValidityDays;
        ticketType.Price = dto.Price;
        ticketType.IsFreeForDisabled = dto.IsFreeForDisabled;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        Db.TicketTypes.Remove(GetAllFromDatabase().Where(t => t.Id == id).Single());
        return Db.SaveChanges() > 0;
    }

    private IQueryable<TicketType> ApplyPagination(IQueryable<TicketType> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<TicketType> ApplyFreeTextSearch(IQueryable<TicketType> query, string text)
    {
        return query.Where(t => t.TypeName.Contains(text));
    }

    private IQueryable<TicketTypeResponseDTO> ApplyMapping(IQueryable<TicketType> query)
    {
        return query.Select(t => new TicketTypeResponseDTO
        {
            Id = t.Id,
            TypeName = t.TypeName,
            ValidityDays = t.ValidityDays,
            Price = t.Price,
            IsFreeForDisabled = t.IsFreeForDisabled
        });
    }

    private IQueryable<TicketType> ApplyFilters(IQueryable<TicketType> query, TicketTypeFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(t => t.Id == filters.Id);
        }

        if (!string.IsNullOrEmpty(filters.TypeName))
        {
            query = query.Where(t => t.TypeName.Contains(filters.TypeName));
        }

        if (filters.MinValidityDays != null)
        {
            query = query.Where(t => t.ValidityDays >= filters.MinValidityDays);
        }

        if (filters.MaxValidityDays != null)
        {
            query = query.Where(t => t.ValidityDays <= filters.MaxValidityDays);
        }

        if (filters.MinPrice != null)
        {
            query = query.Where(t => t.Price >= filters.MinPrice);
        }

        if (filters.MaxPrice != null)
        {
            query = query.Where(t => t.Price <= filters.MaxPrice);
        }

        if (filters.IsFreeForDisabled != null)
        {
            query = query.Where(t => t.IsFreeForDisabled == filters.IsFreeForDisabled);
        }

        return query;
    }

    private IQueryable<TicketType> GetAllFromDatabase()
    {
        return Db.TicketTypes.AsQueryable();
    }
}
