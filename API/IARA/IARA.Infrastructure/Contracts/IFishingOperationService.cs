using IARA.DomainModel.Base;
using IARA.DomainModel.DTOs.RequestDTOs.Modules.CommonModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.BatchesModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.FishingModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.InspectionsModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.NomenclaturesModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.PersonsModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.TELKModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.TicketsModule;using IARA.DomainModel.DTOs.RequestDTOs.Modules.VesselsModule;
using IARA.DomainModel.DTOs.ResponseDTOs.Modules.CommonModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.BatchesModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.FishingModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.InspectionsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.NomenclaturesModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.PersonsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.TELKModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.TicketsModule;using IARA.DomainModel.DTOs.ResponseDTOs.Modules.VesselsModule;
using IARA.DomainModel.Filters;

namespace IARA.Infrastructure.Contracts;

public interface IFishingOperationService
{
    IQueryable<FishingOperationResponseDTO> GetAll(BaseFilter<FishingOperationFilter> filters);
    IQueryable<FishingOperationResponseDTO> Get(int id);
    int Add(FishingOperationCreateRequestDTO dto);
    bool Complete(FishingOperationCompleteRequestDTO dto);
    bool Delete(int id);
}


