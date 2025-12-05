using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

/// <summary>
/// Service interface for User management operations (not authentication)
/// For authentication, use IAuthenticationService
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Gets all users with filtering and pagination
    /// </summary>
    IQueryable<UserResponseDTO> GetAll(BaseFilter<UserFilter> filters);
    
    /// <summary>
    /// Gets a specific user by ID
    /// </summary>
    IQueryable<UserResponseDTO> Get(string id);
    
    /// <summary>
    /// Deletes a user by ID
    /// </summary>
    bool Delete(string id);
}
