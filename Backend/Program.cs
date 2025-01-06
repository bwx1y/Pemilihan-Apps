using System.Text;
using System.Text.Json.Serialization;
using Backend.Databases;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// add db context
builder.Services.AddDbContext<VoteAppContext>(options =>
{
    string connectionType = builder.Configuration.GetConnectionString("Type")!;
    if (connectionType == "MySQL")
        options.UseMySql(builder.Configuration.GetConnectionString("MySQL")!,
            ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("MySQL")!));
    else options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServer")!);
});

// add json setting 
builder.Services.AddControllers().AddJsonOptions(f =>
{
    f.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    f.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

// add validate jwt token
builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ClockSkew = TimeSpan.Zero,
        ValidateIssuer = false,
        ValidateAudience = false,
        RequireExpirationTime = true,
        ValidateLifetime = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["jwt:Key"]!))
    };
});

// Tambahkan Swagger
builder.Services.AddSwaggerGen(swagger =>
{
    swagger.AddSecurityDefinition("Authentication Header", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Tolong isi jwtnya",
        Name = "Authentication",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Authentication Header"
                }
            },
            Array.Empty<string>()
        },
    });
});

// add cors
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(build =>
    {
        build.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var serviceScope = app.Services.CreateScope())
{
    var context = serviceScope.ServiceProvider.GetRequiredService<VoteAppContext>();
    context.Database.EnsureCreated();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();