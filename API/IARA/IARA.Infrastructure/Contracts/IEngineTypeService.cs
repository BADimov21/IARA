using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IEngineTypeService
{
    IQueryable<EngineTypeResponseDTO> GetAll(BaseFilter<EngineTypeFilter> filters);
    IQueryable<EngineTypeResponseDTO> Get(int id);
    int Add(EngineTypeCreateRequestDTO dto);
    bool Edit(EngineTypeUpdateRequestDTO dto);
    bool Delete(int id);
}
