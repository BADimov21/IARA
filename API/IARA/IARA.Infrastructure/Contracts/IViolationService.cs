using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IViolationService
{
    IQueryable<ViolationResponseDTO> GetAll(BaseFilter<ViolationFilter> filters);
    IQueryable<ViolationResponseDTO> Get(int id);
    int Add(ViolationCreateRequestDTO dto);
    bool Edit(ViolationUpdateRequestDTO dto);
    bool Delete(int id);
}
