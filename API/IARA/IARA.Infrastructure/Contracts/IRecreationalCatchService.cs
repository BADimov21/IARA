using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IRecreationalCatchService
{
    IQueryable<RecreationalCatchResponseDTO> GetAll(BaseFilter<RecreationalCatchFilter> filters);
    IQueryable<RecreationalCatchResponseDTO> Get(int id);
    int Add(RecreationalCatchCreateRequestDTO dto);
    bool Delete(int id);
}
