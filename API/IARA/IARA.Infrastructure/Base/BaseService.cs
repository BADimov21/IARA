using IARA.Persistence.Data;
using Microsoft.Extensions.Logging;

namespace IARA.Infrastructure.Base;

public class BaseService
{
    protected readonly ILogger Logger;

    public BaseService(BaseServiceInjector injector)
    {
        Db = injector.Context;
        Logger = injector.LoggerFactory.CreateLogger(GetType());
    }
    
    public IARADbContext Db { get; set; }
}
