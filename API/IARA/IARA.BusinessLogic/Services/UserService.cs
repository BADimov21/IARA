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

    public IQueryable<UserResponseDTO> Get(int id)
    {
        return ApplyMapping(GetAllFromDatabase().Where(u => u.UserId == id));
    }

    public int Register(UserCreateRequestDTO dto)
    {
        // Check if user already exists
        var existingUser = GetAllFromDatabase().FirstOrDefault(u => u.Email == dto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        var user = new User
        {
            Email = dto.Email,
            PasswordHash = dto.Password, // TODO: Hash password
            UserType = dto.UserType
        };

        Db.Users.Add(user);
        Db.SaveChanges();

        return user.UserId;
    }

    public UserAuthResponseDTO Login(UserLoginRequestDTO dto)
    {
        var user = GetAllFromDatabase().FirstOrDefault(u => u.Username == dto.Username);

        if (user == null || user.PasswordHash != dto.Password) // TODO: Hash password comparison
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        return new UserAuthResponseDTO
        {
            UserId = user.UserId,
            Email = user.Email,
            UserType = user.UserType,
            Token = $"token_{user.UserId}" // TODO: Generate JWT token
        };
    }

    public bool Delete(int id)
    {
        Db.Users.Remove(GetAllFromDatabase().Where(u => u.UserId == id).Single());
        return Db.SaveChanges() > 0;
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
            UserId = u.UserId,
            Email = u.Email,
            UserType = u.UserType,
            Username = u.Username,
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
            query = query.Where(u => u.UserId == filters.UserId);
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
