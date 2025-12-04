using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IBatchLocationService
{
    IQueryable<BatchLocationResponseDTO> GetAll(BaseFilter<BatchLocationFilter> filters);
    IQueryable<BatchLocationResponseDTO> Get(int id);
    int Add(BatchLocationCreateRequestDTO dto);
    bool Depart(BatchLocationDepartRequestDTO dto);
    bool Delete(int id);
}
