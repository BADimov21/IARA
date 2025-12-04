using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IFishBatchService
{
    IQueryable<FishBatchResponseDTO> GetAll(BaseFilter<FishBatchFilter> filters);
    IQueryable<FishBatchResponseDTO> Get(int id);
    int Add(FishBatchCreateRequestDTO dto);
    bool Edit(FishBatchUpdateRequestDTO dto);
    bool Delete(int id);
}
