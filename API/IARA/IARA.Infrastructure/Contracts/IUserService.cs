using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.CommonModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.BatchesModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.FishingModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.InspectionsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.NomenclaturesModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.TELKModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.TicketsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.VesselsModule;
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
    
    /// <summary>
    /// Unbans a user by ID (sets IsActive to true)
    /// </summary>
    bool Unban(string id);
}


