using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IFishingGearTypeService
{
    IQueryable<FishingGearTypeResponseDTO> GetAll(BaseFilter<FishingGearTypeFilter> filters);
    IQueryable<FishingGearTypeResponseDTO> Get(int id);
    int Add(FishingGearTypeCreateRequestDTO dto);
    bool Edit(FishingGearTypeUpdateRequestDTO dto);
    bool Delete(int id);
}
