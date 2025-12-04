using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface ITELKDecisionService
{
    IQueryable<TELKDecisionResponseDTO> GetAll(BaseFilter<TELKDecisionFilter> filters);
    IQueryable<TELKDecisionResponseDTO> Get(int id);
    int Add(TELKDecisionCreateRequestDTO dto);
    bool Edit(TELKDecisionUpdateRequestDTO dto);
    bool Delete(int id);
}
