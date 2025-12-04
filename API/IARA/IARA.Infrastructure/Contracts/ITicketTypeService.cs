using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface ITicketTypeService
{
    IQueryable<TicketTypeResponseDTO> GetAll(BaseFilter<TicketTypeFilter> filters);
    IQueryable<TicketTypeResponseDTO> Get(int id);
    int Add(TicketTypeCreateRequestDTO dto);
    bool Edit(TicketTypeUpdateRequestDTO dto);
    bool Delete(int id);
}
