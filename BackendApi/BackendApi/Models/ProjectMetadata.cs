using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models;

/// <summary>
///     Project metadata model, stored in a relational DB
/// </summary>
public sealed class ProjectMetadata
{
    [Key]
    public required int Id { get; set; }

    [StringLength(64)]
    public required string Name { get; set; }

    public ICollection<SessionMetadata> Sessions { get; set; } = null!;
}
