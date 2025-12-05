using IARA.DomainModel.Base;
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

namespace IARA.BusinessLogic.Services.Modules.NomenclaturesModule;

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
            PriceUnder14 = dto.PriceUnder14,
            PriceAdult = dto.PriceAdult,
            PricePensioner = dto.PricePensioner,
            IsFreeForDisabled = dto.IsFreeForDisabled
        };

        Db.TicketTypes.Add(ticketType);
        Db.SaveChanges();

        return ticketType.Id;
    }

    public bool Edit(TicketTypeUpdateRequestDTO dto)
    {
        var ticketType = GetAllFromDatabase().Where(t => t.Id == dto.Id).Single();

        if (dto.TypeName != null) ticketType.TypeName = dto.TypeName;
        if (dto.ValidityDays != null) ticketType.ValidityDays = dto.ValidityDays.Value;
        if (dto.PriceUnder14 != null) ticketType.PriceUnder14 = dto.PriceUnder14.Value;
        if (dto.PriceAdult != null) ticketType.PriceAdult = dto.PriceAdult.Value;
        if (dto.PricePensioner != null) ticketType.PricePensioner = dto.PricePensioner.Value;
        if (dto.IsFreeForDisabled != null) ticketType.IsFreeForDisabled = dto.IsFreeForDisabled.Value;

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
            PriceUnder14 = t.PriceUnder14,
            PriceAdult = t.PriceAdult,
            PricePensioner = t.PricePensioner,
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

        if (filters.MinPrice != null)
        {
            query = query.Where(t => t.PriceAdult >= filters.MinPrice);
        }

        if (filters.MaxPrice != null)
        {
            query = query.Where(t => t.PriceAdult <= filters.MaxPrice);
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




