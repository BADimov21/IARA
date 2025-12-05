using IARA.Persistence.Data;

namespace IARA.Infrastructure.Base;

public class BaseServiceInjector
{
    public BaseServiceInjector(IARADbContext DbContext)
    {
        Context = DbContext;
    }

    public IARADbContext Context { get; set; }
}
