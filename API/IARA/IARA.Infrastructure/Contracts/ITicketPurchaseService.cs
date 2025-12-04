using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface ITicketPurchaseService
{
    IQueryable<TicketPurchaseResponseDTO> GetAll(BaseFilter<TicketPurchaseFilter> filters);
    IQueryable<TicketPurchaseResponseDTO> Get(int id);
    int Add(TicketPurchaseCreateRequestDTO dto);
    bool Delete(int id);
}
