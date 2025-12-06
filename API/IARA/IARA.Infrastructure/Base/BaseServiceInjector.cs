using IARA.Persistence.Data;
using Microsoft.Extensions.Logging;

namespace IARA.Infrastructure.Base;

public class BaseServiceInjector
{
    public BaseServiceInjector(IARADbContext DbContext, ILoggerFactory loggerFactory)
    {
        Context = DbContext;
        LoggerFactory = loggerFactory;
    }

    public IARADbContext Context { get; set; }
    public ILoggerFactory LoggerFactory { get; set; }
}
