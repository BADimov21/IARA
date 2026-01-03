using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.CommonModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.BatchesModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.InspectionsModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.NomenclaturesModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.PersonsModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.TELKModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.TicketsModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.VesselsModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.CommonModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.BatchesModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.FishingModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.InspectionsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.NomenclaturesModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.TELKModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.TicketsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.VesselsModule;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

/// <summary>
/// Service interface for Person entity operations
/// </summary>
public interface IPersonService
{
    IQueryable<PersonResponseDTO> GetAll(BaseFilter<PersonFilter> filters);
    IQueryable<PersonResponseDTO> Get(int id);
    int Add(PersonCreateRequestDTO dto);
    bool Edit(PersonUpdateRequestDTO dto);
    bool Delete(int id);
    
    /// <summary>
    /// Creates a person record for the current authenticated user
    /// </summary>
    Task<int> RegisterUserPersonInfo(string userId, UserPersonInfoRequestDTO dto);
    
    /// <summary>
    /// Gets the person ID associated with a user
    /// </summary>
    int? GetPersonIdByUserId(string userId);
    
    /// <summary>
    /// Checks if a user has completed their personal information
    /// </summary>
    bool HasCompletedPersonalInfo(string userId);
}


