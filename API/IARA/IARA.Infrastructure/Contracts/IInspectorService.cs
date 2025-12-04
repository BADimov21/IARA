using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IInspectorService
{
    IQueryable<InspectorResponseDTO> GetAll(BaseFilter<InspectorFilter> filters);
    IQueryable<InspectorResponseDTO> Get(int id);
    int Add(InspectorCreateRequestDTO dto);
    bool Edit(InspectorUpdateRequestDTO dto);
    bool Delete(int id);
}
