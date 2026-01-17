-- Create the database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'IARA')
BEGIN
    CREATE DATABASE IARA;
END
GO

USE IARA;
GO

-- =============================================
-- CREATE REFERENCE TABLES (No foreign keys)
-- =============================================

-- Engine Types
CREATE TABLE EngineTypes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TypeName NVARCHAR(50) NOT NULL,
    AverageFuelConsumption DECIMAL(6,2) NOT NULL,
    FuelUnit NVARCHAR(20) NOT NULL,
    CONSTRAINT UQ_EngineTypes_TypeName UNIQUE (TypeName)
);

-- Fishing Gear Types
CREATE TABLE FishingGearTypes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TypeName NVARCHAR(100) NOT NULL,
    CONSTRAINT UQ_FishingGearTypes_TypeName UNIQUE (TypeName)
);

-- Fish Species
CREATE TABLE FishSpecies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SpeciesName NVARCHAR(100) NOT NULL,
    CONSTRAINT UQ_FishSpecies_SpeciesName UNIQUE (SpeciesName)
);

-- Persons (base table for owners, captains, inspectors, users)
CREATE TABLE Persons (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    MiddleName NVARCHAR(50) NULL,
    LastName NVARCHAR(50) NOT NULL,
    EGN CHAR(10) NULL,
    DateOfBirth DATE NULL,
    Address NVARCHAR(200) NULL,
    PhoneNumber NVARCHAR(20) NULL,
    CONSTRAINT UQ_Persons_EGN UNIQUE (EGN)
);

-- Ticket Types (for recreational fishing)
CREATE TABLE TicketTypes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TypeName NVARCHAR(100) NOT NULL,
    ValidityDays INT NOT NULL,
    PriceUnder14 DECIMAL(8,2) NOT NULL,
    PriceAdult DECIMAL(8,2) NOT NULL,
    PricePensioner DECIMAL(8,2) NOT NULL,
    IsFreeForDisabled BIT NOT NULL,
    CONSTRAINT UQ_TicketTypes_TypeName UNIQUE (TypeName)
);

-- =============================================
-- CREATE TABLES WITH FOREIGN KEYS
-- =============================================

-- Fishing Gears
CREATE TABLE FishingGears (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    GearTypeId INT NOT NULL,
    MeshSize INT NULL,
    Length DECIMAL(8,2) NULL,
    CONSTRAINT FK_FishingGears_Type FOREIGN KEY (GearTypeId) REFERENCES FishingGearTypes(Id)
);

-- Vessels
CREATE TABLE Vessels (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    InternationalNumber NVARCHAR(20) NOT NULL,
    CallSign NVARCHAR(50) NOT NULL,
    VesselName NVARCHAR(100) NOT NULL,
    Length DECIMAL(6,2) NOT NULL,
    Width DECIMAL(6,2) NOT NULL,
    Draft DECIMAL(6,2) NOT NULL DEFAULT 0.0,
    GrossTonnage DECIMAL(8,2) NOT NULL,
    EnginePower DECIMAL(8,2) NOT NULL,
    EngineTypeId INT NOT NULL,
    OwnerId INT NOT NULL,
    CaptainId INT NOT NULL,
    CONSTRAINT UQ_Vessels_InternationalNumber UNIQUE (InternationalNumber),
    CONSTRAINT FK_Vessels_EngineType FOREIGN KEY (EngineTypeId) REFERENCES EngineTypes(Id),
    CONSTRAINT FK_Vessels_Owner FOREIGN KEY (OwnerId) REFERENCES Persons(Id),
    CONSTRAINT FK_Vessels_Captain FOREIGN KEY (CaptainId) REFERENCES Persons(Id)
);

-- ASP.NET Core Identity Users
CREATE TABLE AspNetUsers (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    UserName NVARCHAR(256) NULL,
    NormalizedUserName NVARCHAR(256) NULL,
    Email NVARCHAR(256) NULL,
    NormalizedEmail NVARCHAR(256) NULL,
    EmailConfirmed BIT NOT NULL DEFAULT 0,
    PasswordHash NVARCHAR(MAX) NULL,
    SecurityStamp NVARCHAR(MAX) NULL,
    ConcurrencyStamp NVARCHAR(MAX) NULL,
    PhoneNumber NVARCHAR(MAX) NULL,
    PhoneNumberConfirmed BIT NOT NULL DEFAULT 0,
    TwoFactorEnabled BIT NOT NULL DEFAULT 0,
    LockoutEnd DATETIMEOFFSET NULL,
    LockoutEnabled BIT NOT NULL DEFAULT 0,
    AccessFailedCount INT NOT NULL DEFAULT 0,
    UserType NVARCHAR(50) NOT NULL DEFAULT 'User',
    PersonId INT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL,
    LastLoginDate DATETIME2 NULL,
    CONSTRAINT FK_AspNetUsers_Persons FOREIGN KEY (PersonId) REFERENCES Persons(Id)
);

-- ASP.NET Core Identity Roles
CREATE TABLE AspNetRoles (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    Name NVARCHAR(256) NULL,
    NormalizedName NVARCHAR(256) NULL,
    ConcurrencyStamp NVARCHAR(MAX) NULL
);

-- ASP.NET Core Identity User Roles
CREATE TABLE AspNetUserRoles (
    UserId NVARCHAR(450) NOT NULL,
    RoleId NVARCHAR(450) NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    CONSTRAINT FK_AspNetUserRoles_AspNetUsers FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE,
    CONSTRAINT FK_AspNetUserRoles_AspNetRoles FOREIGN KEY (RoleId) REFERENCES AspNetRoles(Id) ON DELETE CASCADE
);

-- ASP.NET Core Identity User Claims
CREATE TABLE AspNetUserClaims (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId NVARCHAR(450) NOT NULL,
    ClaimType NVARCHAR(MAX) NULL,
    ClaimValue NVARCHAR(MAX) NULL,
    CONSTRAINT FK_AspNetUserClaims_AspNetUsers FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

-- ASP.NET Core Identity User Logins
CREATE TABLE AspNetUserLogins (
    LoginProvider NVARCHAR(450) NOT NULL,
    ProviderKey NVARCHAR(450) NOT NULL,
    ProviderDisplayName NVARCHAR(MAX) NULL,
    UserId NVARCHAR(450) NOT NULL,
    PRIMARY KEY (LoginProvider, ProviderKey),
    CONSTRAINT FK_AspNetUserLogins_AspNetUsers FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

-- ASP.NET Core Identity User Tokens
CREATE TABLE AspNetUserTokens (
    UserId NVARCHAR(450) NOT NULL,
    LoginProvider NVARCHAR(450) NOT NULL,
    Name NVARCHAR(450) NOT NULL,
    Value NVARCHAR(MAX) NULL,
    PRIMARY KEY (UserId, LoginProvider, Name),
    CONSTRAINT FK_AspNetUserTokens_AspNetUsers FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

-- ASP.NET Core Identity Role Claims
CREATE TABLE AspNetRoleClaims (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RoleId NVARCHAR(450) NOT NULL,
    ClaimType NVARCHAR(MAX) NULL,
    ClaimValue NVARCHAR(MAX) NULL,
    CONSTRAINT FK_AspNetRoleClaims_AspNetRoles FOREIGN KEY (RoleId) REFERENCES AspNetRoles(Id) ON DELETE CASCADE
);

-- TELK Decisions (for disabled persons)
CREATE TABLE TELKDecisions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PersonId INT NOT NULL,
    DecisionNumber NVARCHAR(50) NOT NULL,
    IssueDate DATE NOT NULL,
    ValidUntil DATE NULL,
    CONSTRAINT UQ_TELKDecisions_DecisionNumber UNIQUE (DecisionNumber),
    CONSTRAINT FK_TELK_Person FOREIGN KEY (PersonId) REFERENCES Persons(Id)
);

-- Inspectors
CREATE TABLE Inspectors (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PersonId INT NOT NULL,
    BadgeNumber NVARCHAR(50) NOT NULL,
    CONSTRAINT UQ_Inspectors_PersonId UNIQUE (PersonId),
    CONSTRAINT UQ_Inspectors_BadgeNumber UNIQUE (BadgeNumber),
    CONSTRAINT FK_Inspectors_Person FOREIGN KEY (PersonId) REFERENCES Persons(Id)
);

-- Ticket Purchases (recreational fishing)
CREATE TABLE TicketPurchases (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TicketNumber NVARCHAR(50) NOT NULL,
    TicketTypeId INT NOT NULL,
    PersonId INT NOT NULL,
    PurchaseDate DATE NOT NULL DEFAULT (CONVERT(DATE, GETDATE())),
    ValidFrom DATE NOT NULL,
    ValidUntil DATE NOT NULL,
    PricePaid DECIMAL(8,2) NOT NULL,
    TELKDecisionId INT NULL,
    CONSTRAINT UQ_TicketPurchases_TicketNumber UNIQUE (TicketNumber),
    CONSTRAINT FK_TicketPurchases_Type FOREIGN KEY (TicketTypeId) REFERENCES TicketTypes(Id),
    CONSTRAINT FK_TicketPurchases_Person FOREIGN KEY (PersonId) REFERENCES Persons(Id),
    CONSTRAINT FK_TicketPurchases_TELK FOREIGN KEY (TELKDecisionId) REFERENCES TELKDecisions(Id)
);

-- Fishing Permits
CREATE TABLE FishingPermits (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PermitNumber NVARCHAR(50) NOT NULL,
    VesselId INT NOT NULL,
    IssueDate DATE NOT NULL,
    ValidFrom DATE NOT NULL,
    ValidUntil DATE NOT NULL,
    IsRevoked BIT NOT NULL DEFAULT 0,
    CONSTRAINT UQ_FishingPermits_PermitNumber UNIQUE (PermitNumber),
    CONSTRAINT FK_FishingPermits_Vessel FOREIGN KEY (VesselId) REFERENCES Vessels(Id)
);

-- Permit Fishing Gears (many-to-many)
CREATE TABLE PermitFishingGears (
    PermitId INT NOT NULL,
    FishingGearId INT NOT NULL,
    PRIMARY KEY (PermitId, FishingGearId),
    CONSTRAINT FK_PermitGears_Permit FOREIGN KEY (PermitId) REFERENCES FishingPermits(Id),
    CONSTRAINT FK_PermitGears_Gear FOREIGN KEY (FishingGearId) REFERENCES FishingGears(Id)
);

-- Fishing Trips
CREATE TABLE FishingTrips (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    VesselId INT NOT NULL,
    PermitId INT NOT NULL,
    DepartureDateTime DATETIME2 NOT NULL,
    DeparturePort NVARCHAR(100) NOT NULL,
    ArrivalDateTime DATETIME2 NULL,
    ArrivalPort NVARCHAR(100) NULL,
    DurationHours AS (DATEDIFF(MINUTE, DepartureDateTime, ISNULL(ArrivalDateTime, SYSDATETIME())) / 60.0),
    CONSTRAINT FK_FishingTrips_Vessel FOREIGN KEY (VesselId) REFERENCES Vessels(Id),
    CONSTRAINT FK_FishingTrips_Permit FOREIGN KEY (PermitId) REFERENCES FishingPermits(Id)
);

-- Fishing Operations
CREATE TABLE FishingOperations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TripId INT NOT NULL,
    FishingGearId INT NOT NULL,
    StartDateTime DATETIME2 NOT NULL,
    EndDateTime DATETIME2 NULL,
    Location NVARCHAR(200) NULL,
    CONSTRAINT FK_FishingOps_Trip FOREIGN KEY (TripId) REFERENCES FishingTrips(Id),
    CONSTRAINT FK_FishingOps_Gear FOREIGN KEY (FishingGearId) REFERENCES FishingGears(Id)
);

-- Catches (commercial fishing)
CREATE TABLE Catches (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OperationId INT NOT NULL,
    SpeciesId INT NOT NULL,
    Quantity INT NOT NULL,
    WeightKg DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_Catches_Operation FOREIGN KEY (OperationId) REFERENCES FishingOperations(Id),
    CONSTRAINT FK_Catches_Species FOREIGN KEY (SpeciesId) REFERENCES FishSpecies(Id)
);

-- Recreational Catches
CREATE TABLE RecreationalCatches (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TicketPurchaseId INT NOT NULL,
    PersonId INT NOT NULL,
    SpeciesId INT NOT NULL,
    CatchDateTime DATETIME2 NOT NULL,
    Location NVARCHAR(200) NULL,
    Quantity INT NOT NULL,
    WeightKg DECIMAL(8,2) NOT NULL,
    CONSTRAINT FK_RecCatches_Ticket FOREIGN KEY (TicketPurchaseId) REFERENCES TicketPurchases(Id),
    CONSTRAINT FK_RecCatches_Person FOREIGN KEY (PersonId) REFERENCES Persons(Id),
    CONSTRAINT FK_RecCatches_Species FOREIGN KEY (SpeciesId) REFERENCES FishSpecies(Id)
);

-- Landings
CREATE TABLE Landings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TripId INT NOT NULL,
    LandingDateTime DATETIME2 NOT NULL,
    Port NVARCHAR(100) NOT NULL,
    TotalWeightKg DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    CONSTRAINT FK_Landings_Trip FOREIGN KEY (TripId) REFERENCES FishingTrips(Id)
);

-- Fish Batches (batch traceability)
CREATE TABLE FishBatches (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    LandingId INT NOT NULL,
    SpeciesId INT NOT NULL,
    BatchCode NVARCHAR(50) NOT NULL,
    WeightKg DECIMAL(10,2) NOT NULL,
    Quantity INT NULL,
    CONSTRAINT UQ_FishBatches_BatchCode UNIQUE (BatchCode),
    CONSTRAINT FK_FishBatches_Landing FOREIGN KEY (LandingId) REFERENCES Landings(Id),
    CONSTRAINT FK_FishBatches_Species FOREIGN KEY (SpeciesId) REFERENCES FishSpecies(Id)
);

-- Batch Locations (supply chain tracking)
CREATE TABLE BatchLocations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    BatchId INT NOT NULL,
    LocationType NVARCHAR(50) NOT NULL,
    LocationName NVARCHAR(200) NOT NULL,
    ArrivedAt DATETIME2 NOT NULL,
    DepartedAt DATETIME2 NULL,
    CONSTRAINT FK_BatchLocations_Batch FOREIGN KEY (BatchId) REFERENCES FishBatches(Id)
);

-- Inspections
CREATE TABLE Inspections (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    InspectorId INT NOT NULL,
    InspectionDateTime DATETIME2 NOT NULL,
    InspectionType NVARCHAR(50) NOT NULL,
    VesselId INT NULL,
    BatchId INT NULL,
    TicketPurchaseId INT NULL,
    Location NVARCHAR(200) NULL,
    Observations NVARCHAR(1000) NULL,
    IsCompliant BIT NOT NULL,
    CONSTRAINT FK_Inspections_Inspector FOREIGN KEY (InspectorId) REFERENCES Inspectors(Id),
    CONSTRAINT FK_Inspections_Vessel FOREIGN KEY (VesselId) REFERENCES Vessels(Id),
    CONSTRAINT FK_Inspections_Batch FOREIGN KEY (BatchId) REFERENCES FishBatches(Id),
    CONSTRAINT FK_Inspections_Ticket FOREIGN KEY (TicketPurchaseId) REFERENCES TicketPurchases(Id)
);

-- Violations
CREATE TABLE Violations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    InspectionId INT NOT NULL,
    ViolationType NVARCHAR(100) NULL,
    Description NVARCHAR(500) NOT NULL,
    FineAmount DECIMAL(10,2) NOT NULL,
    IsPaid BIT NOT NULL DEFAULT 0,
    PaidDate DATETIME2 NULL,
    CONSTRAINT FK_Violations_Inspection FOREIGN KEY (InspectionId) REFERENCES Inspections(Id) ON DELETE CASCADE
);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Foreign Key Indexes
CREATE INDEX IX_FishingGears_GearTypeId ON FishingGears(GearTypeId);
CREATE INDEX IX_Vessels_EngineTypeId ON Vessels(EngineTypeId);
CREATE INDEX IX_Vessels_OwnerId ON Vessels(OwnerId);
CREATE INDEX IX_Vessels_CaptainId ON Vessels(CaptainId);
CREATE INDEX IX_Vessels_InternationalNumber ON Vessels(InternationalNumber);
CREATE INDEX IX_AspNetUsers_PersonId ON AspNetUsers(PersonId);
CREATE INDEX IX_AspNetUsers_NormalizedEmail ON AspNetUsers(NormalizedEmail);
CREATE INDEX IX_AspNetUserRoles_RoleId ON AspNetUserRoles(RoleId);
CREATE INDEX IX_AspNetUserClaims_UserId ON AspNetUserClaims(UserId);
CREATE INDEX IX_AspNetUserLogins_UserId ON AspNetUserLogins(UserId);
CREATE INDEX IX_AspNetRoleClaims_RoleId ON AspNetRoleClaims(RoleId);
CREATE INDEX IX_TELKDecisions_PersonId ON TELKDecisions(PersonId);
CREATE INDEX IX_TicketPurchases_TicketTypeId ON TicketPurchases(TicketTypeId);
CREATE INDEX IX_TicketPurchases_PersonId ON TicketPurchases(PersonId);
CREATE INDEX IX_TicketPurchases_TELKDecisionId ON TicketPurchases(TELKDecisionId);
CREATE INDEX IX_FishingPermits_VesselId ON FishingPermits(VesselId);
CREATE INDEX IX_FishingPermits_ValidUntil ON FishingPermits(ValidUntil);
CREATE INDEX IX_FishingTrips_VesselId ON FishingTrips(VesselId);
CREATE INDEX IX_FishingTrips_PermitId ON FishingTrips(PermitId);
CREATE INDEX IX_FishingTrips_DepartureDateTime ON FishingTrips(DepartureDateTime);
CREATE INDEX IX_FishingOperations_TripId ON FishingOperations(TripId);
CREATE INDEX IX_FishingOperations_FishingGearId ON FishingOperations(FishingGearId);
CREATE INDEX IX_Catches_OperationId ON Catches(OperationId);
CREATE INDEX IX_Catches_SpeciesId ON Catches(SpeciesId);
CREATE INDEX IX_RecreationalCatches_TicketPurchaseId ON RecreationalCatches(TicketPurchaseId);
CREATE INDEX IX_RecreationalCatches_PersonId ON RecreationalCatches(PersonId);
CREATE INDEX IX_RecreationalCatches_SpeciesId ON RecreationalCatches(SpeciesId);
CREATE INDEX IX_RecreationalCatches_CatchDateTime ON RecreationalCatches(CatchDateTime);
CREATE INDEX IX_Landings_TripId ON Landings(TripId);
CREATE INDEX IX_FishBatches_LandingId ON FishBatches(LandingId);
CREATE INDEX IX_FishBatches_SpeciesId ON FishBatches(SpeciesId);
CREATE INDEX IX_FishBatches_BatchCode ON FishBatches(BatchCode);
CREATE INDEX IX_BatchLocations_BatchId ON BatchLocations(BatchId);
CREATE INDEX IX_Inspections_InspectorId ON Inspections(InspectorId);
CREATE INDEX IX_Inspections_VesselId ON Inspections(VesselId);
CREATE INDEX IX_Inspections_BatchId ON Inspections(BatchId);
CREATE INDEX IX_Inspections_TicketPurchaseId ON Inspections(TicketPurchaseId);
CREATE INDEX IX_Inspections_InspectionDateTime ON Inspections(InspectionDateTime);
CREATE INDEX IX_Violations_InspectionId ON Violations(InspectionId);

-- Additional indexes for search and lookups
CREATE INDEX IX_Persons_EGN ON Persons(EGN);
CREATE INDEX IX_Persons_LastName ON Persons(LastName, FirstName);
CREATE UNIQUE INDEX IX_AspNetUsers_NormalizedUserName ON AspNetUsers(NormalizedUserName) WHERE NormalizedUserName IS NOT NULL;
CREATE UNIQUE INDEX IX_AspNetRoles_NormalizedName ON AspNetRoles(NormalizedName) WHERE NormalizedName IS NOT NULL;

-- =============================================
-- SEED DATA
-- =============================================

-- Seed Ticket Types
SET IDENTITY_INSERT TicketTypes ON;
INSERT INTO TicketTypes (Id, TypeName, ValidityDays, PriceUnder14, PriceAdult, PricePensioner, IsFreeForDisabled)
VALUES 
    (1, N'Daily Ticket', 1, 5.0, 15.0, 10.0, 1),
    (2, N'Weekly Ticket', 7, 15.0, 30.0, 20.0, 1),
    (3, N'Monthly Ticket', 30, 30.0, 60.0, 40.0, 1),
    (4, N'Annual Ticket', 365, 100.0, 200.0, 150.0, 1);
SET IDENTITY_INSERT TicketTypes OFF;

-- =============================================
-- CREATE MIGRATION HISTORY TABLE
-- =============================================
CREATE TABLE __EFMigrationsHistory (
    MigrationId NVARCHAR(150) NOT NULL PRIMARY KEY,
    ProductVersion NVARCHAR(32) NOT NULL
);

-- Record all migrations as applied
INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion)
VALUES 
    ('20251205034412_CreateUsers', '9.0.11'),
    ('20251205072301_AuthenticationMigration', '9.0.11'),
    ('20260103211624_SeedTicketTypes', '9.0.11'),
    ('20260105213242_AddDraftToVessel', '9.0.11'),
    ('20260105222331_AddPaymentTrackingToViolation', '9.0.11'),
    ('20260111002034_AddTotalWeightKgToLandingAndQuantityToFishBatch', '9.0.11'),
    ('20260111010116_AddLocationAndObservationsToInspection', '9.0.11'),
    ('20260111010800_AddViolationTypeToViolation', '9.0.11');