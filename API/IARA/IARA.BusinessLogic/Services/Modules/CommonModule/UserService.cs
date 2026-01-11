using IARA.DomainModel.Base;
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
using Microsoft.AspNetCore.Identity;

namespace IARA.BusinessLogic.Services.Modules.CommonModule;

/// <summary>
/// Service for user management operations (not authentication)
/// For authentication, use AuthenticationService
/// </summary>
public class UserService : BaseService, IUserService
{
    private readonly UserManager<User> _userManager;

    public UserService(BaseServiceInjector injector, UserManager<User> userManager) : base(injector)
    {
        _userManager = userManager;
    }

    public IQueryable<UserResponseDTO> GetAll(BaseFilter<UserFilter> filters)
    {
        if (string.IsNullOrEmpty(filters.FreeTextSearch))
        {
            return ApplyMapping(ApplyPagination(ApplyFilters(GetAllFromDatabase(), filters.Filters), filters.Page, filters.PageSize));
        }
        return ApplyMapping(ApplyPagination(ApplyFreeTextSearch(GetAllFromDatabase(), filters.FreeTextSearch), filters.Page, filters.PageSize));
    }

    public IQueryable<UserResponseDTO> Get(string id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(u => u.Id == id));
    }

    public bool Delete(string id)
    {
        var user = _userManager.Users.FirstOrDefault(u => u.Id == id);
        if (user != null)
        {
            // Ban user by setting IsActive to false instead of deleting
            user.IsActive = false;
            var result = _userManager.UpdateAsync(user).Result;
            return result.Succeeded;
        }
        return false;
    }

    public bool Unban(string id)
    {
        var user = _userManager.Users.FirstOrDefault(u => u.Id == id);
        if (user != null)
        {
            // Unban user by setting IsActive back to true
            user.IsActive = true;
            var result = _userManager.UpdateAsync(user).Result;
            return result.Succeeded;
        }
        return false;
    }

    private IQueryable<User> GetAllFromDatabase()
    {
        // Show all users, including banned ones
        return _userManager.Users;
    }

    private IQueryable<User> ApplyPagination(IQueryable<User> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<User> ApplyFreeTextSearch(IQueryable<User> query, string text)
    {
        return query.Where(u => u.Email != null && u.Email.Contains(text));
    }

    private IQueryable<UserResponseDTO> ApplyMapping(IQueryable<User> query)
    {
        return query.Select(u => new UserResponseDTO
        {
            UserId = u.Id,
            Email = u.Email ?? string.Empty,
            UserType = u.UserType,
            Username = u.UserName ?? string.Empty,
            PersonId = u.PersonId,
            IsActive = u.IsActive,
            CreatedDate = u.CreatedDate,
            LastLoginDate = u.LastLoginDate
        });
    }

    private IQueryable<User> ApplyFilters(IQueryable<User> query, UserFilter? filters)
    {
        if (filters == null)
        {
            return query;
        }

        if (!string.IsNullOrEmpty(filters.UserId))
        {
            query = query.Where(u => u.Id == filters.UserId);
        }

        if (!string.IsNullOrEmpty(filters.Username))
        {
            query = query.Where(u => u.UserName != null && u.UserName.Contains(filters.Username));
        }

        if (!string.IsNullOrEmpty(filters.Email))
        {
            query = query.Where(u => u.Email != null && u.Email.Contains(filters.Email));
        }

        if (!string.IsNullOrEmpty(filters.UserType))
        {
            query = query.Where(u => u.UserType == filters.UserType);
        }

        if (filters.PersonId != null)
        {
            query = query.Where(u => u.PersonId == filters.PersonId);
        }

        if (filters.IsActive != null)
        {
            query = query.Where(u => u.IsActive == filters.IsActive);
        }

        if (filters.CreatedDateFrom != null)
        {
            query = query.Where(u => u.CreatedDate >= filters.CreatedDateFrom);
        }

        if (filters.CreatedDateTo != null)
        {
            query = query.Where(u => u.CreatedDate <= filters.CreatedDateTo);
        }

        if (filters.LastLoginDateFrom != null)
        {
            query = query.Where(u => u.LastLoginDate >= filters.LastLoginDateFrom);
        }

        if (filters.LastLoginDateTo != null)
        {
            query = query.Where(u => u.LastLoginDate <= filters.LastLoginDateTo);
        }

        return query;
    }
}




