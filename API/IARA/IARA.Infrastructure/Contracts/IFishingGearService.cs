using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IFishingGearService
{
    IQueryable<FishingGearResponseDTO> GetAll(BaseFilter<FishingGearFilter> filters);
    IQueryable<FishingGearResponseDTO> Get(int id);
    int Add(FishingGearCreateRequestDTO dto);
    bool Edit(FishingGearUpdateRequestDTO dto);
    bool Delete(int id);
}
