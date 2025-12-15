# IARA - Fishery Information System

A comprehensive fishing management system built with ASP.NET Core, Entity Framework Core, and SQL Server. IARA provides a complete API for managing fishing operations, vessels, permits, catches, inspections, and recreational fishing activities.

## 🎯 Features

### Core Modules

- **🎣 Fishing Module**
  - Fishing gear management
  - Fishing operations tracking
  - Fishing trip management
  - Fishing permits administration
  - Catch recording and reporting

- **📦 Batches Module**
  - Fish batch tracking
  - Landing records
  - Batch location history

- **🔍 Inspections Module**
  - Inspection management
  - Inspector registration
  - Violation tracking and reporting

- **🚢 Vessels Module**
  - Vessel registration
  - Engine specifications
  - Owner and captain management

- **👥 Persons Module**
  - Person registration and management
  - EGN (Bulgarian ID) support

- **🎟️ Tickets Module**
  - Ticket type management
  - Ticket purchases
  - Recreational catch tracking

- **📋 TELK Module**
  - TELK decision management
  - Disability-related fishing permits

- **📚 Nomenclatures Module**
  - Fish species catalog
  - Fishing gear types
  - Engine types
  - Ticket types

### Authentication & Security

- 🔐 JWT-based authentication
- 🛡️ ASP.NET Core Identity integration
- 🔑 Role-based authorization
- 🚪 Secure password policies

## 🏗️ Architecture

The project follows Clean Architecture principles with clear separation of concerns:

```
IARA/
├── API/IARA/
│   ├── IARA.API/              # Web API layer (Controllers, Middleware)
│   ├── IARA.BusinessLogic/    # Business logic layer (Services)
│   ├── IARA.DomainModel/      # Domain models (DTOs, Filters)
│   ├── IARA.Infrastructure/   # Infrastructure layer (Interfaces, Base classes)
│   └── IARA.Persistence/      # Data access layer (Entities, DbContext, Migrations)
└── WEB/                       # Frontend application (separate)
```

### Technology Stack

- **Framework**: .NET 9.0
- **ORM**: Entity Framework Core 9.0
- **Database**: SQL Server (LocalDB for development)
- **Authentication**: ASP.NET Core Identity + JWT
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Microsoft.Extensions.Logging

## 🚀 Getting Started

### Prerequisites

- .NET 9.0 SDK or later
- SQL Server or SQL Server LocalDB
- Visual Studio 2022 / VS Code / Rider (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BADimov21/IARA.git
   cd IARA
   ```

2. **Configure environment variables**
   
   Create a `.env` file in `IARA.API` project directory:
   ```bash
   cd API/IARA/IARA.API
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_CONNECTION_STRING=Server=(localdb)\\mssqllocaldb;Database=IARA_DB;Trusted_Connection=true;MultipleActiveResultSets=true
   
   # JWT Configuration (CHANGE IN PRODUCTION!)
   JWT_SECRET_KEY=YourSecretKeyHereThatShouldBeAtLeast32CharactersLong
   JWT_ISSUER=IARA.API
   JWT_AUDIENCE=IARA.Client
   ```
   
   ⚠️ **Security Notice**: 
   - Never commit `.env` to source control (already in `.gitignore`)
   - Generate a strong random key for production
   - The `.env` file is loaded automatically by `DotNetEnv` package

3. **Run database migrations**
   ```bash
   cd API/IARA
   dotnet ef database update --project IARA.Persistence --startup-project IARA.API
   ```

4. **Run the application**
   ```bash
   cd IARA.API
   dotnet run
   ```

5. **Access Swagger UI**
   
   Navigate to: `https://localhost:7xxx/swagger` (port may vary)

## 🔧 Configuration

### Environment Variables

The application uses environment variables for sensitive configuration. Create a `.env` file in the `IARA.API` directory:

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_CONNECTION_STRING` | SQL Server connection string | `Server=(localdb)\\mssqllocaldb;Database=IARA_DB;...` |
| `JWT_SECRET_KEY` | Secret key for JWT signing (min 32 chars) | Generate a secure random string |
| `JWT_ISSUER` | JWT token issuer | `IARA.API` |
| `JWT_AUDIENCE` | JWT token audience | `IARA.Client` |

**Fallback**: If environment variables are not set, the application falls back to `appsettings.json` values (development only).

### JWT Settings

JWT configuration is managed through environment variables (`.env` file) with fallback to `appsettings.json`:

```json
{
  "Jwt": {
    "Issuer": "IARA.API",
    "Audience": "IARA.Client",
    "Key": "FALLBACK-KEY-USE-ENV-FILE-INSTEAD-32CHARS",
    "ExpiresInMinutes": "60"
  }
}
```

⚠️ **Production Security**:
- Always use environment variables in production
- Generate a cryptographically secure random key (minimum 32 characters)
- Never commit secrets to source control
- Rotate keys periodically

### CORS Configuration

CORS is configured with two policies:
- **Development**: Allows localhost origins (3000, 4200, 5173)
- **Production**: Allows all origins (configure as needed)

Modify CORS settings in `Program.cs` as required for your deployment.

## 📡 API Endpoints

### Authentication
- `POST /api/authentication/register` - Register new user
- `POST /api/authentication/login` - Login and receive JWT token

### Fishing Module
- `GET /api/fishinggear` - Get all fishing gear
- `POST /api/fishinggear` - Create fishing gear
- `GET /api/fishingtrip` - Get all fishing trips
- `POST /api/fishingtrip` - Create fishing trip
- `GET /api/fishingoperation` - Get all fishing operations
- `POST /api/catch` - Record a catch

### Vessels
- `GET /api/vessel` - Get all vessels
- `POST /api/vessel` - Register new vessel
- `PUT /api/vessel` - Update vessel information

### Inspections
- `GET /api/inspection` - Get all inspections
- `POST /api/inspection` - Create inspection
- `GET /api/violation` - Get all violations

*See Swagger UI for complete API documentation*

## 🗄️ Database Schema

The database consists of 20+ tables including:

- **Core Entities**: Person, User, Vessel, FishSpecy
- **Fishing Operations**: FishingTrip, FishingOperation, FishingPermit, FishingGear, Catch
- **Batches**: FishBatch, Landing, BatchLocation
- **Inspections**: Inspection, Inspector, Violation
- **Tickets**: TicketType, TicketPurchase, RecreationalCatch
- **Nomenclatures**: EngineType, FishingGearType
- **TELK**: TELKDecision

### Entity Relationships

- Vessels have Owners and Captains (Person)
- Fishing Trips require Permits and belong to Vessels
- Fishing Operations are part of Trips and use Fishing Gear
- Catches are recorded during Operations
- Landings create Fish Batches
- Inspections can target Vessels, Batches, or Ticket Purchases

## 🔐 Authentication Flow

1. **Register**: POST to `/api/authentication/register` with user details
2. **Login**: POST to `/api/authentication/login` with credentials
3. **Receive Token**: Get JWT token in response
4. **Use Token**: Include token in Authorization header: `Bearer {token}`
5. **Access Protected Endpoints**: All API endpoints require authentication

## 🛠️ Development

### Running Migrations

Create a new migration:
```bash
dotnet ef migrations add MigrationName --project IARA.Persistence --startup-project IARA.API
```

Apply migrations:
```bash
dotnet ef database update --project IARA.Persistence --startup-project IARA.API
```

### Project Structure

- **Controllers**: Located in `IARA.API/Controllers/Modules/`
- **Services**: Located in `IARA.BusinessLogic/Services/Modules/`
- **Entities**: Located in `IARA.Persistence/Data/Entities/`
- **DTOs**: Located in `IARA.DomainModel/DTOs/`
- **Filters**: Located in `IARA.DomainModel/Filters/`

### Adding a New Feature

1. Create entity in `IARA.Persistence/Data/Entities/`
2. Create DTOs in `IARA.DomainModel/DTOs/`
3. Create filter in `IARA.DomainModel/Filters/`
4. Create service interface in `IARA.Infrastructure/Contracts/`
5. Implement service in `IARA.BusinessLogic/Services/`
6. Create controller in `IARA.API/Controllers/`
7. Register service in `Program.cs`
8. Create and apply migration

## 🐛 Error Handling

The API uses global exception handling middleware that returns standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Bad request",
  "detail": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

## 📝 Logging

Logging is integrated throughout the application:
- All services inherit from `BaseService` with built-in logging
- Logs are written to console (configurable in `appsettings.json`)
- Log levels: Information, Warning, Error

Configure logging in `appsettings.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

## 🧪 Testing

*Testing infrastructure to be implemented*

Planned test coverage:
- Unit tests for services
- Integration tests for API endpoints
- Database integration tests

## 📦 Deployment

### Production Checklist

- [ ] Update JWT secret key
- [ ] Configure production connection string
- [ ] Update CORS policy for production origins
- [ ] Enable HTTPS
- [ ] Configure logging for production
- [ ] Set up error monitoring
- [ ] Configure database backup strategy
- [ ] Review and apply security headers
- [ ] Set environment to Production

### Docker Support

*Docker configuration to be added*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **BADimov21** - [GitHub Profile](https://github.com/BADimov21)

## 🙏 Acknowledgments

- ASP.NET Core team for the excellent framework
- Entity Framework Core team for the ORM
- The .NET community for guidance and best practices

---

**Version**: 1.0.0  
**Last Updated**: December 2025