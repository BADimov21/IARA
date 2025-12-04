using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
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
}
