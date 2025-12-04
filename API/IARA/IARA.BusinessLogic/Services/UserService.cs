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

    public IQueryable<UserResponseDTO> Get(int userId)
    {
        return ApplyMapping(GetAllFromDatabase().Where(u => u.UserId == userId));
    }

    public int Register(UserRegisterRequestDTO dto)
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
            Role = dto.Role
        };

        Db.Users.Add(user);
        Db.SaveChanges();

        return user.UserId;
    }

    public UserAuthResponseDTO Login(UserLoginRequestDTO dto)
    {
        var user = GetAllFromDatabase().FirstOrDefault(u => u.Email == dto.Email);

        if (user == null || user.PasswordHash != dto.Password) // TODO: Hash password comparison
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        return new UserAuthResponseDTO
        {
            UserId = user.UserId,
            Email = user.Email,
            Role = user.Role,
            Token = $"token_{user.UserId}" // TODO: Generate JWT token
        };
    }

    public bool Update(UserUpdateRequestDTO dto)
    {
        var user = GetAllFromDatabase().Where(u => u.UserId == dto.UserId).Single();

        user.Email = dto.Email;
        user.Role = dto.Role;

        if (!string.IsNullOrEmpty(dto.Password))
        {
            user.PasswordHash = dto.Password; // TODO: Hash password
        }

        return Db.SaveChanges() > 0;
    }

    public bool Delete(int userId)
    {
        Db.Users.Remove(GetAllFromDatabase().Where(u => u.UserId == userId).Single());
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
            Role = u.Role
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

        if (!string.IsNullOrEmpty(filters.Role))
        {
            query = query.Where(u => u.Role == filters.Role);
        }

        return query;
    }

    private IQueryable<User> GetAllFromDatabase()
    {
        return Db.Users.AsQueryable();
    }
}
