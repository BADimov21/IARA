using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IFishingOperationService
{
    IQueryable<FishingOperationResponseDTO> GetAll(BaseFilter<FishingOperationFilter> filters);
    IQueryable<FishingOperationResponseDTO> Get(int id);
    int Add(FishingOperationCreateRequestDTO dto);
    bool Complete(FishingOperationCompleteRequestDTO dto);
    bool Delete(int id);
}
