using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface ICatchService
{
    IQueryable<CatchResponseDTO> GetAll(BaseFilter<CatchFilter> filters);
    IQueryable<CatchResponseDTO> Get(int id);
    int Add(CatchCreateRequestDTO dto);
    bool Edit(CatchUpdateRequestDTO dto);
    bool Delete(int id);
}
