using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Persistence.Data.Entities;

namespace IARA.BusinessLogic.Services;

public class UserService : BaseService, IUserService
{
    public UserService(BaseServiceInjector injector) : base(injector)
    {
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

    public string Register(UserCreateRequestDTO dto)
    {
        // Check if user already exists
        var existingUser = GetAllFromDatabase().FirstOrDefault(u => u.Email == dto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        var user = new User
        {
            UserName = dto.Email, // Use email as username
            Email = dto.Email,
            UserType = dto.UserType
        };

        // Note: Password should be hashed properly using UserManager
        // This is a simplified version - use AuthenticationService.Register for proper user registration

        Db.Users.Add(user);
        Db.SaveChanges();

        return user.Id;
    }

    public UserAuthResponseDTO Login(UserLoginRequestDTO dto)
    {
        var user = GetAllFromDatabase().FirstOrDefault(u => u.UserName == dto.Username);

        // Note: This is simplified - use AuthenticationService.Login for proper authentication
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        return new UserAuthResponseDTO
        {
            UserId = user.Id,
            Email = user.Email ?? string.Empty,
            UserType = user.UserType,
            Token = $"token_{user.Id}" // TODO: Generate JWT token
        };
    }

    public bool Delete(string id)
    {
        var user = GetAllFromDatabase().FirstOrDefault(u => u.Id == id);
        if (user != null)
        {
            Db.Users.Remove(user);
            return Db.SaveChanges() > 0;
        }
        return false;
    }

    private IQueryable<User> ApplyPagination(IQueryable<User> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }

    private IQueryable<User> ApplyFreeTextSearch(IQueryable<User> query, string text)
    {
        return query.Where(u => u.Email.Contains(text));
    }

    private IQueryable<UserResponseDTO> ApplyMapping(IQueryable<User> query)
    {
        return query.Select(u => new UserResponseDTO
        {
            UserId = u.Id,
            Email = u.Email,
            UserType = u.UserType,
            Username = u.UserName,
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

        if (filters.UserId != null)
        {
            query = query.Where(u => u.Id == filters.UserId);
        }

        if (!string.IsNullOrEmpty(filters.Email))
        {
            query = query.Where(u => u.Email.Contains(filters.Email));
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

        return query;
    }

    private IQueryable<User> GetAllFromDatabase()
    {
        return Db.Users.AsQueryable();
    }
}

