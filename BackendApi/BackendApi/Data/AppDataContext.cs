using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Data;

public sealed class AppDataContext : DbContext
{
    public required DbSet<ProjectMetadata> Projects { get; set; }
    public required DbSet<SessionMetadata> Sessions { get; set; }

    public AppDataContext(DbContextOptions<AppDataContext> options)
        : base(options)
    {
    }
}
