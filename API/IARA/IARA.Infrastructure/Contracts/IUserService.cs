using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

/// <summary>
/// Service interface for User entity operations
/// </summary>
public interface IUserService
{
    IQueryable<UserResponseDTO> GetAll(BaseFilter<UserFilter> filters);
    IQueryable<UserResponseDTO> Get(int id);
    int Register(UserCreateRequestDTO dto);
    UserAuthResponseDTO Login(UserLoginRequestDTO dto);
    bool Delete(int id);
}
