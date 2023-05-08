using BackendApi.Data;
using BackendApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ProjectsController : ControllerBase
{
    private readonly ILogger<ProjectsController> logger;
    private readonly AppDataContext dataContext;

    public ProjectsController(ILogger<ProjectsController> logger, AppDataContext dataContext)
    {
        this.logger = logger;
        this.dataContext = dataContext;
    }

    [HttpPost]
    public async Task<IActionResult> Create(ProjectMetadata metadata)
    {
        logger.LogInformation("Request received to create a project called {}", metadata.Name);

        var entry = await dataContext.Projects.AddAsync(metadata);
        var entity = entry.Entity;

        await dataContext.SaveChangesAsync();

        return Ok(entity.Id);
    }

    [HttpPut]
    public async Task<IActionResult> Update(ProjectMetadata metadata)
    {
        logger.LogInformation("Request received to update project {}", metadata.Id);

        var entry = await dataContext.Projects
            .FirstOrDefaultAsync(x => x.Id == metadata.Id);

        if (entry is null)
        {
            return NotFound(new { Message = $"Project with id \"{metadata.Id}\" was not found" });
        }

        entry.Name = metadata.Name;
        await dataContext.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(ProjectMetadata metadata)
    {
        logger.LogInformation("Request received to delete project {}", metadata.Id);

        var entry = await dataContext.Projects
            .FirstOrDefaultAsync(x => x.Id == metadata.Id);

        if (entry is null)
        {
            return NotFound(new { Message = $"Project with id \"{metadata.Id}\" was not found" });
        }

        dataContext.Remove(entry);
        await dataContext.SaveChangesAsync();

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var data = await dataContext.Projects
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync();

        return Ok(data);
    }
}
