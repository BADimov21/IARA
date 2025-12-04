using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IInspectionService
{
    IQueryable<InspectionResponseDTO> GetAll(BaseFilter<InspectionFilter> filters);
    IQueryable<InspectionResponseDTO> Get(int id);
    int Add(InspectionCreateRequestDTO dto);
    bool Edit(InspectionUpdateRequestDTO dto);
    bool Delete(int id);
}
