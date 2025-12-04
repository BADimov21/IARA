using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IFishingPermitService
{
    IQueryable<FishingPermitResponseDTO> GetAll(BaseFilter<FishingPermitFilter> filters);
    IQueryable<FishingPermitResponseDTO> Get(int id);
    int Add(FishingPermitCreateRequestDTO dto);
    bool Revoke(FishingPermitRevokeRequestDTO dto);
    bool Delete(int id);
}
