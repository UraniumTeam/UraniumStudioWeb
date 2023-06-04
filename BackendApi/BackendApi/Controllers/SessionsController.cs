using Amazon.S3;
using Amazon.S3.Model;
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
    private readonly AmazonS3Client s3Client;
    private readonly IConfiguration configuration;
    private readonly string sessionDirectory;

    public SessionsController(ILogger<SessionsController> logger, AppDataContext dataContext, AmazonS3Client s3Client,
        IConfiguration configuration)
    {
        this.logger = logger;
        this.dataContext = dataContext;
        this.s3Client = s3Client;
        this.configuration = configuration;

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
        var bucketName = configuration["S3BucketName"];

        var request = new PutObjectRequest
        {
            BucketName = bucketName,
            Key = sessionId.ToString(),
            InputStream = formFile.OpenReadStream()
        };

        try
        {
            await s3Client.PutObjectAsync(request);
        }
        catch (AmazonS3Exception e)
        {
            logger.LogError(e, "Error while trying to upload file {} to S3", fileName);
        }

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
