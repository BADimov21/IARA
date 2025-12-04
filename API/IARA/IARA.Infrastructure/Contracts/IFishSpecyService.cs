using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IFishSpecyService
{
    IQueryable<FishSpecyResponseDTO> GetAll(BaseFilter<FishSpecyFilter> filters);
    IQueryable<FishSpecyResponseDTO> Get(int id);
    int Add(FishSpecyCreateRequestDTO dto);
    bool Edit(FishSpecyUpdateRequestDTO dto);
    bool Delete(int id);
}
