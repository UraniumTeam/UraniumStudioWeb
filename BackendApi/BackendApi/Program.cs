using Amazon.S3;
using BackendApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
    options.AddPolicy("CorsPolicy", policyBuilder => policyBuilder
        .AllowCredentials()
        .AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins("http://localhost:3000")));

builder.Services.AddDbContext<AppDataContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

var s3Config = new AmazonS3Config
{
    ServiceURL = "https://s3.yandexcloud.net",
    AuthenticationRegion = "ru-central1"
};

builder.Services.AddSingleton<AmazonS3Client>(_ => new AmazonS3Client(s3Config));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDataContext>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
    }
}

app.Run();
