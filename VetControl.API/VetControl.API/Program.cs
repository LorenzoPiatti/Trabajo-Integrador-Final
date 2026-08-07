using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using VetControl.Application.Interfaces;
using VetControl.Application.Services;
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