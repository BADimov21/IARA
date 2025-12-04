using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IFishingTripService
{
    IQueryable<FishingTripResponseDTO> GetAll(BaseFilter<FishingTripFilter> filters);
    IQueryable<FishingTripResponseDTO> Get(int id);
    int Add(FishingTripCreateRequestDTO dto);
    bool Complete(FishingTripCompleteRequestDTO dto);
    bool Delete(int id);
}
