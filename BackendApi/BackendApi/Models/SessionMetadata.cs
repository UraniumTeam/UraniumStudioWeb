using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BackendApi.Models;

public sealed class SessionMetadata
{
    [Key]
    public required Guid Id { get; set; }
    
    public required int ProjectId { get; set; }

    [JsonIgnore]
    public ProjectMetadata Project { get; set; } = null!;
}
