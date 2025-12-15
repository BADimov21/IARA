using System.Text;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using IARA.API.Middleware;
using IARA.BusinessLogic.Services.Modules.BatchesModule;
using IARA.BusinessLogic.Services.Modules.CommonModule;
using IARA.BusinessLogic.Services.Modules.FishingModule;
using IARA.BusinessLogic.Services.Modules.InspectionsModule;
using IARA.BusinessLogic.Services.Modules.NomenclaturesModule;
using IARA.BusinessLogic.Services.Modules.PersonsModule;
using IARA.BusinessLogic.Services.Modules.TELKModule;
using IARA.BusinessLogic.Services.Modules.TicketsModule;
using IARA.BusinessLogic.Services.Modules.VesselsModule;
using IARA.Infrastructure.Base;
using IARA.Infrastructure.Contracts;
using IARA.Infrastructure.Services;
using IARA.Persistence.Data;
using IARA.Persistence.Data.Entities;

namespace IARA.API;

public class Program
{
    public static void Main(string[] args)
    {
        // Load environment variables from .env file
        Env.Load();
        
        var builder = WebApplication.CreateBuilder(args);

        // Add database context - use .env or appsettings
        var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") 
                               ?? builder.Configuration.GetConnectionString("DefaultConnection")
                               ?? throw new InvalidOperationException("Database connection string not found");
        
        builder.Services.AddDbContext<IARADbContext>(options =>
            options.UseSqlServer(connectionString));

        // Add Identity
        builder.Services.AddIdentity<User, IdentityRole>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 6;
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<IARADbContext>()
        .AddDefaultTokenProviders();

        // Add JWT Authentication - use .env or appsettings
        var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") 
                     ?? builder.Configuration["Jwt:Key"] 
                     ?? throw new InvalidOperationException("JWT secret key not found");
        var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") 
                        ?? builder.Configuration["Jwt:Issuer"];
        var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") 
                          ?? builder.Configuration["Jwt:Audience"];
        
        var key = Encoding.UTF8.GetBytes(jwtKey);
        
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };
        });

        // Add services to the container.
        builder.Services.AddAuthorization();

        // Add CORS policy
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            });

            options.AddPolicy("Development", policy =>
            {
                policy.WithOrigins("http://localhost:3000", "http://localhost:4200", "http://localhost:5173")
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();
            });
        });

        // Register Base Service Injector
        builder.Services.AddScoped<BaseServiceInjector>();

        // Register Common Module services
        builder.Services.AddScoped<ITokenService, TokenService>();
        builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
        builder.Services.AddScoped<IUserService, UserService>();

        // Register Fishing Module services
        builder.Services.AddScoped<IFishingGearService, FishingGearService>();
        builder.Services.AddScoped<IFishingOperationService, FishingOperationService>();
        builder.Services.AddScoped<IFishingPermitService, FishingPermitService>();
        builder.Services.AddScoped<IFishingTripService, FishingTripService>();
        builder.Services.AddScoped<ICatchService, CatchService>();

        // Register Batches Module services
        builder.Services.AddScoped<IFishBatchService, FishBatchService>();
        builder.Services.AddScoped<ILandingService, LandingService>();
        builder.Services.AddScoped<IBatchLocationService, BatchLocationService>();

        // Register Inspections Module services
        builder.Services.AddScoped<IInspectionService, InspectionService>();
        builder.Services.AddScoped<IInspectorService, InspectorService>();
        builder.Services.AddScoped<IViolationService, ViolationService>();

        // Register Vessels Module services
        builder.Services.AddScoped<IVesselService, VesselService>();

        // Register Persons Module services
        builder.Services.AddScoped<IPersonService, PersonService>();

        // Register TELK Module services
        builder.Services.AddScoped<ITELKDecisionService, TELKDecisionService>();

        // Register Tickets Module services
        builder.Services.AddScoped<ITicketTypeService, TicketTypeService>();
        builder.Services.AddScoped<ITicketPurchaseService, TicketPurchaseService>();
        builder.Services.AddScoped<IRecreationalCatchService, RecreationalCatchService>();

        // Register Nomenclatures Module services
        builder.Services.AddScoped<IFishSpecyService, FishSpecyService>();
        builder.Services.AddScoped<IFishingGearTypeService, FishingGearTypeService>();
        builder.Services.AddScoped<IEngineTypeService, EngineTypeService>();

        // Add controllers
        builder.Services.AddControllers();

        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();
        
        // Add Swagger services
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
            {
                Title = "IARA API",
                Version = "v1",
                Description = "API for the IARA fishing management system"
            });

            // Add JWT Authentication to Swagger
            options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
                Name = "Authorization",
                In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });

            options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
            {
                {
                    new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                    {
                        Reference = new Microsoft.OpenApi.Models.OpenApiReference
                        {
                            Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        var app = builder.Build();

        // Add global exception handling middleware
        app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            
            // Enable Swagger UI
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "IARA API v1");
                options.RoutePrefix = "swagger";
            });

            // Use development CORS policy
            app.UseCors("Development");
        }
        else
        {
            // Use production CORS policy (configure as needed)
            app.UseCors("AllowAll");
        }

        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        // Map controllers
        app.MapControllers();

        app.Run();
    }
}
