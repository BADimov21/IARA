using IARA.Persistence.Data;

namespace IARA.Infrastructure.Base;

public class BaseService
{
    public BaseService(BaseServiceInjector injector)
    {
        Db = injector.Context;
    }
    
    public IARADbContext Db { get; set; }
}
