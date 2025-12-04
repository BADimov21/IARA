using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs;
using IARA.DomainModel.DTOs.ResponseDTOs;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

/// <summary>
/// Service interface for Vessel entity operations
/// </summary>
public interface IVesselService
{
    IQueryable<VesselResponseDTO> GetAll(BaseFilter<VesselFilter> filters);
    IQueryable<VesselResponseDTO> Get(int id);
    int Add(VesselCreateRequestDTO dto);
    bool Edit(VesselUpdateRequestDTO dto);
    bool Delete(int id);
}
