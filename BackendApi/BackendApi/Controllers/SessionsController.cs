using BackendApi.Data;
using BackendApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public sealed class SessionsController : ControllerBase
{
    private readonly ILogger<SessionsController> logger;
    private readonly AppDataContext dataContext;
    private readonly string sessionDirectory;

    public SessionsController(ILogger<SessionsController> logger, AppDataContext dataContext)
    {
        this.logger = logger;
        this.dataContext = dataContext;

        sessionDirectory = Path.Join(Directory.GetCurrentDirectory(), "sessions");
        if (!Directory.Exists(sessionDirectory))
        {
            Directory.CreateDirectory(sessionDirectory);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Upload(int projectId, IFormFile formFile)
    {
        var fileName = Path.GetFileName(formFile.FileName);
        logger.LogInformation("Request received to upload session file {}", fileName);

        if (formFile.Length <= 0)
        {
            return BadRequest(new { message = "File was empty" });
        }

        var sessionId = Guid.NewGuid();
        var filePath = Path.Join(sessionDirectory, sessionId + ".upx");
        await using var stream = System.IO.File.Create(filePath);
        await formFile.CopyToAsync(stream);

        var metadata = new SessionMetadata
        {
            Id = sessionId,
            ProjectId = projectId
        };

        await dataContext.Sessions.AddAsync(metadata);
        await dataContext.SaveChangesAsync();

        return Ok(new { sessionId });
    }
}
