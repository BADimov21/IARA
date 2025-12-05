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

namespace IARA.BusinessLogic.Services.Modules.PersonsModule;

/// <summary>
/// Service for managing Person entities
/// </summary>
public class PersonService : BaseService, IPersonService
{
    public PersonService(BaseServiceInjector injector) : base(injector)
    {
    }

    public IQueryable<PersonResponseDTO> GetAll(BaseFilter<PersonFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<PersonResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(p => p.Id == id));
    }

    public int Add(PersonCreateRequestDTO dto)
    {
        var person = new Person
        {
            FirstName = dto.FirstName,
            MiddleName = dto.MiddleName,
            LastName = dto.LastName,
            EGN = dto.EGN,
            DateOfBirth = dto.DateOfBirth,
            Address = dto.Address,
            PhoneNumber = dto.PhoneNumber
        };

        Db.Persons.Add(person);
        Db.SaveChanges();

        return person.Id;
    }

    public bool Edit(PersonUpdateRequestDTO dto)
    {
        var person = GetAllFromDatabase().FirstOrDefault(p => p.Id == dto.Id);
        
        if (person == null)
        {
            return false;
        }

        // Update only provided fields
        if (dto.FirstName != null)
            person.FirstName = dto.FirstName;
        
        if (dto.MiddleName != null)
            person.MiddleName = dto.MiddleName;
        
        if (dto.LastName != null)
            person.LastName = dto.LastName;
        
        if (dto.EGN != null)
            person.EGN = dto.EGN;
        
        if (dto.DateOfBirth != null)
            person.DateOfBirth = dto.DateOfBirth;
        
        if (dto.Address != null)
            person.Address = dto.Address;
        
        if (dto.PhoneNumber != null)
            person.PhoneNumber = dto.PhoneNumber;

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int id)
    {
        var person = GetAllFromDatabase().FirstOrDefault(p => p.Id == id);
        
        if (person == null)
        {
            return false;
        }

        Db.Persons.Remove(person);
        return Db.SaveChanges() > 0;
    }

    private IQueryable<Person> GetAllFromDatabase()
    {
        return Db.Persons;
    }

    private IQueryable<Person> ApplyPagination(IQueryable<Person> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<Person> ApplyFreeTextSearch(IQueryable<Person> query, string text)
    {
        return query.Where(p => 
            p.FirstName.Contains(text) || 
            p.LastName.Contains(text) || 
            (p.MiddleName != null && p.MiddleName.Contains(text)) ||
            (p.EGN != null && p.EGN.Contains(text)) ||
            (p.PhoneNumber != null && p.PhoneNumber.Contains(text)));
    }

    private IQueryable<PersonResponseDTO> ApplyMapping(IQueryable<Person> query)
    {
        return query.Select(p => new PersonResponseDTO
        {
            Id = p.Id,
            FirstName = p.FirstName,
            MiddleName = p.MiddleName,
            LastName = p.LastName,
            EGN = p.EGN,
            DateOfBirth = p.DateOfBirth,
            Address = p.Address,
            PhoneNumber = p.PhoneNumber
        });
    }

    private IQueryable<Person> ApplyFilters(IQueryable<Person> query, PersonFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (filters.Id != null)
        {
            query = query.Where(p => p.Id == filters.Id);
        }

        if (!string.IsNullOrEmpty(filters.FirstName))
        {
            query = query.Where(p => p.FirstName.Contains(filters.FirstName));
        }

        if (!string.IsNullOrEmpty(filters.MiddleName))
        {
            query = query.Where(p => p.MiddleName != null && p.MiddleName.Contains(filters.MiddleName));
        }

        if (!string.IsNullOrEmpty(filters.LastName))
        {
            query = query.Where(p => p.LastName.Contains(filters.LastName));
        }

        if (!string.IsNullOrEmpty(filters.EGN))
        {
            query = query.Where(p => p.EGN != null && p.EGN.Contains(filters.EGN));
        }

        if (filters.DateOfBirthFrom != null)
        {
            query = query.Where(p => p.DateOfBirth >= filters.DateOfBirthFrom);
        }

        if (filters.DateOfBirthTo != null)
        {
            query = query.Where(p => p.DateOfBirth <= filters.DateOfBirthTo);
        }

        if (!string.IsNullOrEmpty(filters.PhoneNumber))
        {
            query = query.Where(p => p.PhoneNumber != null && p.PhoneNumber.Contains(filters.PhoneNumber));
        }

        if (!string.IsNullOrEmpty(filters.Address))
        {
            query = query.Where(p => p.Address != null && p.Address.Contains(filters.Address));
        }

        return query;
    }
}




