using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using VetControl.Application.Interfaces;
using VetControl.Application.Services;
using VetControl.Domain.Entities;
using VetControl.Domain.Enums;
using VetControl.Infrastructure.Data;
using VetControl.Infrastructure.Repositories;
using VetControl.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// LOGS
// Configura los proveedores que muestran información
// y errores mientras se ejecuta la aplicación.
// ======================================================

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();


// ======================================================
// PROTECCIÓN DE DATOS
// Guarda las claves utilizadas para proteger información
// sensible, como tokens de recuperación de contraseña.
// ======================================================

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(
        new DirectoryInfo(
            Path.Combine(
                builder.Environment.ContentRootPath,
                "DataProtectionKeys"
            )
        )
    );


// ======================================================
// BASE DE DATOS
// Registra VetControlDbContext y configura SQL Server.
// EnableRetryOnFailure reintenta la conexión si ocurre
// un error temporal con la base de datos.
// ======================================================

builder.Services.AddDbContext<VetControlDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"
        ),
        sqlOptions =>
            sqlOptions.EnableRetryOnFailure()
    )
);


// ======================================================
// CORS
// Permite que los frontend ejecutados en estos puertos
// puedan realizar solicitudes a la API.
// ======================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// ======================================================
// CONTROLADORES
// Registra los controladores de la API.
// ======================================================

builder.Services.AddControllers();


// ======================================================
// AUTENTICACIÓN JWT
// Configura la validación de los tokens enviados por
// los usuarios al acceder a endpoints protegidos.
// ======================================================

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme
    )
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                // Comprueba quién emitió el token.
                ValidateIssuer = true,

                // Comprueba para quién fue emitido.
                ValidateAudience = true,

                // Comprueba que el token no esté vencido.
                ValidateLifetime = true,

                // Comprueba que la firma sea válida.
                ValidateIssuerSigningKey = true,

                // Valores configurados en appsettings.json.
                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                // Clave utilizada para validar la firma.
                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            builder.Configuration["Jwt:Key"]!
                        )
                    )
            };
    });

// Registra los servicios necesarios para aplicar
// autorización mediante roles, por ejemplo "Owner".
builder.Services.AddAuthorization();


// ======================================================
// INYECCIÓN DE DEPENDENCIAS
// Relaciona cada interfaz con su implementación concreta.
// ======================================================


// ------------------------------------------------------
// AUTENTICACIÓN Y USUARIOS
// ------------------------------------------------------

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();


// ------------------------------------------------------
// MASCOTAS
// ------------------------------------------------------

builder.Services.AddScoped<IPetRepository, PetRepository>();
builder.Services.AddScoped<IPetService, PetService>();


// ------------------------------------------------------
// DUEÑOS
// ------------------------------------------------------

builder.Services.AddScoped<IOwnerRepository, OwnerRepository>();


// ------------------------------------------------------
// PERFIL DE USUARIO
// ------------------------------------------------------

builder.Services.AddScoped<IProfileService, ProfileService>();



// ------------------------------------------------------
// TURNOS
// ------------------------------------------------------

builder.Services.AddScoped<
    IAppointmentRepository,
    AppointmentRepository
>();

builder.Services.AddScoped<
    IAppointmentService,
    AppointmentService
>();


// ------------------------------------------------------
// VACUNAS
// ------------------------------------------------------

builder.Services.AddScoped<
    IVaccineRepository,
    VaccineRepository
>();

builder.Services.AddScoped<
    IVaccineService,
    VaccineService
>();


// ------------------------------------------------------
// HISTORIAS CLÍNICAS
// ------------------------------------------------------

builder.Services.AddScoped<
    IMedicalRecordRepository,
    MedicalRecordRepository
>();

builder.Services.AddScoped<
    IMedicalRecordService,
    MedicalRecordService
>();


// ------------------------------------------------------
// RECORDATORIOS Y NOTIFICACIONES
// ------------------------------------------------------

builder.Services.AddScoped<
    IReminderRepository,
    ReminderRepository
>();

builder.Services.AddScoped<
    IReminderService,
    ReminderService
>();


// ======================================================
// SWAGGER
// Permite documentar y probar los endpoints de la API.
// ======================================================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// ======================================================
// CONSTRUCCIÓN DE LA APLICACIÓN
// A partir de este punto se configura el pipeline HTTP.
// ======================================================

var app = builder.Build();

await SeedInitialAdminAsync(
    app.Services,
    app.Configuration);


// Swagger se habilita solamente durante el desarrollo.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Redirige las solicitudes HTTP hacia HTTPS.
app.UseHttpsRedirection();


// Aplica la política que permite solicitudes del frontend.
app.UseCors("AllowFrontend");


// Primero identifica al usuario mediante el JWT.
app.UseAuthentication();

// Después comprueba sus permisos y roles.
app.UseAuthorization();


// Conecta las rutas HTTP con los controladores.
app.MapControllers();


// Inicia la aplicación.
app.Run();

static async Task SeedInitialAdminAsync(
    IServiceProvider services,
    IConfiguration configuration)
{
    var enabled = string.Equals(
        configuration["SeedAdmin:Enabled"],
        "true",
        StringComparison.OrdinalIgnoreCase);

    var email =
        configuration["SeedAdmin:Email"]?.Trim();

    var password =
        configuration["SeedAdmin:Password"]?.Trim();

    if (!enabled ||
        string.IsNullOrWhiteSpace(email) ||
        string.IsNullOrWhiteSpace(password))
    {
        return;
    }

    var name =
        configuration["SeedAdmin:Name"]?.Trim();

    using var scope = services.CreateScope();

    var dbContext =
        scope.ServiceProvider
            .GetRequiredService<VetControlDbContext>();

    var normalizedEmail =
        email.ToLowerInvariant();

    var user =
        await dbContext.Users
            .FirstOrDefaultAsync(u =>
                u.Email.ToLower() == normalizedEmail);

    if (user is null)
    {
        await dbContext.Users.AddAsync(
            new User
            {
                Name = string.IsNullOrWhiteSpace(name)
                    ? "Administrador"
                    : name,
                Email = email,
                Password = password,
                Role = UserRole.Admin,
                Active = true,
                EmailVerified = true
            });
    }
    else
    {
        if (!string.IsNullOrWhiteSpace(name))
        {
            user.Name = name;
        }

        user.Role = UserRole.Admin;
        user.Active = true;
        user.EmailVerified = true;
    }

    await dbContext.SaveChangesAsync();
}
