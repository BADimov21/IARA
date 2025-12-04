using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface ILandingService
{
    IQueryable<LandingResponseDTO> GetAll(BaseFilter<LandingFilter> filters);
    IQueryable<LandingResponseDTO> Get(int id);
    int Add(LandingCreateRequestDTO dto);
    bool Edit(LandingUpdateRequestDTO dto);
    bool Delete(int id);
}
