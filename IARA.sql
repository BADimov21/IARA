IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [EngineTypes] (
    [Id] int NOT NULL IDENTITY,
    [TypeName] nvarchar(50) NOT NULL,
    [AverageFuelConsumption] decimal(6,2) NOT NULL,
    [FuelUnit] nvarchar(20) NOT NULL,
    CONSTRAINT [PK__EngineTy__3214EC07F3BAB40A] PRIMARY KEY ([Id])
);

CREATE TABLE [FishingGearTypes] (
    [Id] int NOT NULL IDENTITY,
    [TypeName] nvarchar(100) NOT NULL,
    CONSTRAINT [PK__FishingG__3214EC072E68112E] PRIMARY KEY ([Id])
);

CREATE TABLE [FishSpecies] (
    [Id] int NOT NULL IDENTITY,
    [SpeciesName] nvarchar(100) NOT NULL,
    CONSTRAINT [PK__FishSpec__3214EC07845DB5B2] PRIMARY KEY ([Id])
);

CREATE TABLE [Persons] (
    [Id] int NOT NULL IDENTITY,
    [FirstName] nvarchar(50) NOT NULL,
    [MiddleName] nvarchar(50) NULL,
    [LastName] nvarchar(50) NOT NULL,
    [EGN] char(10) NULL,
    [DateOfBirth] date NULL,
    [Address] nvarchar(200) NULL,
    [PhoneNumber] nvarchar(20) NULL,
    CONSTRAINT [PK__Persons__3214EC07AF20FDAD] PRIMARY KEY ([Id])
);

CREATE TABLE [TicketTypes] (
    [Id] int NOT NULL IDENTITY,
    [TypeName] nvarchar(100) NOT NULL,
    [ValidityDays] int NOT NULL,
    [PriceUnder14] decimal(8,2) NOT NULL,
    [PriceAdult] decimal(8,2) NOT NULL,
    [PricePensioner] decimal(8,2) NOT NULL,
    [IsFreeForDisabled] bit NOT NULL,
    CONSTRAINT [PK__TicketTy__3214EC077D6B8F05] PRIMARY KEY ([Id])
);

CREATE TABLE [FishingGears] (
    [Id] int NOT NULL IDENTITY,
    [GearTypeId] int NOT NULL,
    [MeshSize] int NULL,
    [Length] decimal(8,2) NULL,
    CONSTRAINT [PK__FishingG__3214EC070D3BD345] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FishingGears_Type] FOREIGN KEY ([GearTypeId]) REFERENCES [FishingGearTypes] ([Id])
);

CREATE TABLE [Inspectors] (
    [Id] int NOT NULL IDENTITY,
    [PersonId] int NOT NULL,
    [BadgeNumber] nvarchar(50) NOT NULL,
    CONSTRAINT [PK__Inspecto__3214EC071830EEF4] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Inspectors_Person] FOREIGN KEY ([PersonId]) REFERENCES [Persons] ([Id])
);

CREATE TABLE [TELKDecisions] (
    [Id] int NOT NULL IDENTITY,
    [PersonId] int NOT NULL,
    [DecisionNumber] nvarchar(50) NOT NULL,
    [IssueDate] date NOT NULL,
    [ValidUntil] date NULL,
    CONSTRAINT [PK__TELKDeci__3214EC07FDF32121] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TELK_Person] FOREIGN KEY ([PersonId]) REFERENCES [Persons] ([Id])
);

CREATE TABLE [Users] (
    [UserId] int NOT NULL IDENTITY,
    [Username] nvarchar(100) NOT NULL,
    [PasswordHash] nvarchar(255) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [UserType] nvarchar(50) NOT NULL,
    [PersonId] int NULL,
    [IsActive] bit NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [LastLoginDate] datetime2 NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([UserId]),
    CONSTRAINT [FK_Users_Persons_PersonId] FOREIGN KEY ([PersonId]) REFERENCES [Persons] ([Id])
);

CREATE TABLE [Vessels] (
    [Id] int NOT NULL IDENTITY,
    [InternationalNumber] nvarchar(20) NOT NULL,
    [CallSign] nvarchar(50) NOT NULL,
    [VesselName] nvarchar(100) NOT NULL,
    [Length] decimal(6,2) NOT NULL,
    [Width] decimal(6,2) NOT NULL,
    [GrossTonnage] decimal(8,2) NOT NULL,
    [EnginePower] decimal(8,2) NOT NULL,
    [EngineTypeId] int NOT NULL,
    [OwnerId] int NOT NULL,
    [CaptainId] int NOT NULL,
    CONSTRAINT [PK__Vessels__3214EC07203BA2D7] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Vessels_Captain] FOREIGN KEY ([CaptainId]) REFERENCES [Persons] ([Id]),
    CONSTRAINT [FK_Vessels_EngineType] FOREIGN KEY ([EngineTypeId]) REFERENCES [EngineTypes] ([Id]),
    CONSTRAINT [FK_Vessels_Owner] FOREIGN KEY ([OwnerId]) REFERENCES [Persons] ([Id])
);

CREATE TABLE [TicketPurchases] (
    [Id] int NOT NULL IDENTITY,
    [TicketNumber] nvarchar(50) NOT NULL,
    [TicketTypeId] int NOT NULL,
    [PersonId] int NOT NULL,
    [PurchaseDate] date NOT NULL DEFAULT ((CONVERT([date],getdate()))),
    [ValidFrom] date NOT NULL,
    [ValidUntil] date NOT NULL,
    [PricePaid] decimal(8,2) NOT NULL,
    [TELKDecisionId] int NULL,
    CONSTRAINT [PK__TicketPu__3214EC0714114533] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TicketPurchases_Person] FOREIGN KEY ([PersonId]) REFERENCES [Persons] ([Id]),
    CONSTRAINT [FK_TicketPurchases_TELK] FOREIGN KEY ([TELKDecisionId]) REFERENCES [TELKDecisions] ([Id]),
    CONSTRAINT [FK_TicketPurchases_Type] FOREIGN KEY ([TicketTypeId]) REFERENCES [TicketTypes] ([Id])
);

CREATE TABLE [FishingPermits] (
    [Id] int NOT NULL IDENTITY,
    [PermitNumber] nvarchar(50) NOT NULL,
    [VesselId] int NOT NULL,
    [IssueDate] date NOT NULL,
    [ValidFrom] date NOT NULL,
    [ValidUntil] date NOT NULL,
    [IsRevoked] bit NOT NULL,
    CONSTRAINT [PK__FishingP__3214EC0761E55F54] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FishingPermits_Vessel] FOREIGN KEY ([VesselId]) REFERENCES [Vessels] ([Id])
);

CREATE TABLE [RecreationalCatches] (
    [Id] int NOT NULL IDENTITY,
    [TicketPurchaseId] int NOT NULL,
    [PersonId] int NOT NULL,
    [SpeciesId] int NOT NULL,
    [CatchDateTime] datetime2 NOT NULL,
    [Location] nvarchar(200) NULL,
    [Quantity] int NOT NULL,
    [WeightKg] decimal(8,2) NOT NULL,
    CONSTRAINT [PK__Recreati__3214EC0763B75942] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RecCatches_Person] FOREIGN KEY ([PersonId]) REFERENCES [Persons] ([Id]),
    CONSTRAINT [FK_RecCatches_Species] FOREIGN KEY ([SpeciesId]) REFERENCES [FishSpecies] ([Id]),
    CONSTRAINT [FK_RecCatches_Ticket] FOREIGN KEY ([TicketPurchaseId]) REFERENCES [TicketPurchases] ([Id])
);

CREATE TABLE [FishingTrips] (
    [Id] int NOT NULL IDENTITY,
    [VesselId] int NOT NULL,
    [PermitId] int NOT NULL,
    [DepartureDateTime] datetime2 NOT NULL,
    [DeparturePort] nvarchar(100) NOT NULL,
    [ArrivalDateTime] datetime2 NULL,
    [ArrivalPort] nvarchar(100) NULL,
    [DurationHours] AS (datediff(minute,[DepartureDateTime],isnull([ArrivalDateTime],sysdatetime()))/(60.0)),
    CONSTRAINT [PK__FishingT__3214EC07E117A50E] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FishingTrips_Permit] FOREIGN KEY ([PermitId]) REFERENCES [FishingPermits] ([Id]),
    CONSTRAINT [FK_FishingTrips_Vessel] FOREIGN KEY ([VesselId]) REFERENCES [Vessels] ([Id])
);

CREATE TABLE [PermitFishingGears] (
    [PermitId] int NOT NULL,
    [FishingGearId] int NOT NULL,
    CONSTRAINT [PK__PermitFi__7E72B374CA7502B2] PRIMARY KEY ([PermitId], [FishingGearId]),
    CONSTRAINT [FK_PermitGears_Gear] FOREIGN KEY ([FishingGearId]) REFERENCES [FishingGears] ([Id]),
    CONSTRAINT [FK_PermitGears_Permit] FOREIGN KEY ([PermitId]) REFERENCES [FishingPermits] ([Id])
);

CREATE TABLE [FishingOperations] (
    [Id] int NOT NULL IDENTITY,
    [TripId] int NOT NULL,
    [FishingGearId] int NOT NULL,
    [StartDateTime] datetime2 NOT NULL,
    [EndDateTime] datetime2 NULL,
    [Location] nvarchar(200) NULL,
    CONSTRAINT [PK__FishingO__3214EC075248B5A6] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FishingOps_Gear] FOREIGN KEY ([FishingGearId]) REFERENCES [FishingGears] ([Id]),
    CONSTRAINT [FK_FishingOps_Trip] FOREIGN KEY ([TripId]) REFERENCES [FishingTrips] ([Id])
);

CREATE TABLE [Landings] (
    [Id] int NOT NULL IDENTITY,
    [TripId] int NOT NULL,
    [LandingDateTime] datetime2 NOT NULL,
    [Port] nvarchar(100) NOT NULL,
    CONSTRAINT [PK__Landings__3214EC07C0CFF55A] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Landings_Trip] FOREIGN KEY ([TripId]) REFERENCES [FishingTrips] ([Id])
);

CREATE TABLE [Catches] (
    [Id] int NOT NULL IDENTITY,
    [OperationId] int NOT NULL,
    [SpeciesId] int NOT NULL,
    [Quantity] int NOT NULL,
    [WeightKg] decimal(10,2) NOT NULL,
    CONSTRAINT [PK__Catches__3214EC073BE14AF7] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Catches_Operation] FOREIGN KEY ([OperationId]) REFERENCES [FishingOperations] ([Id]),
    CONSTRAINT [FK_Catches_Species] FOREIGN KEY ([SpeciesId]) REFERENCES [FishSpecies] ([Id])
);

CREATE TABLE [FishBatches] (
    [Id] int NOT NULL IDENTITY,
    [LandingId] int NOT NULL,
    [SpeciesId] int NOT NULL,
    [BatchCode] nvarchar(50) NOT NULL,
    [WeightKg] decimal(10,2) NOT NULL,
    CONSTRAINT [PK__FishBatc__3214EC07A14E5831] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FishBatches_Landing] FOREIGN KEY ([LandingId]) REFERENCES [Landings] ([Id]),
    CONSTRAINT [FK_FishBatches_Species] FOREIGN KEY ([SpeciesId]) REFERENCES [FishSpecies] ([Id])
);

CREATE TABLE [BatchLocations] (
    [Id] int NOT NULL IDENTITY,
    [BatchId] int NOT NULL,
    [LocationType] nvarchar(50) NOT NULL,
    [LocationName] nvarchar(200) NOT NULL,
    [ArrivedAt] datetime2 NOT NULL,
    [DepartedAt] datetime2 NULL,
    CONSTRAINT [PK__BatchLoc__3214EC07D580DB2D] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BatchLocations_Batch] FOREIGN KEY ([BatchId]) REFERENCES [FishBatches] ([Id])
);

CREATE TABLE [Inspections] (
    [Id] int NOT NULL IDENTITY,
    [InspectorId] int NOT NULL,
    [InspectionDateTime] datetime2 NOT NULL,
    [InspectionType] nvarchar(50) NOT NULL,
    [VesselId] int NULL,
    [BatchId] int NULL,
    [TicketPurchaseId] int NULL,
    [IsCompliant] bit NOT NULL,
    CONSTRAINT [PK__Inspecti__3214EC07555A727C] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Inspections_Batch] FOREIGN KEY ([BatchId]) REFERENCES [FishBatches] ([Id]),
    CONSTRAINT [FK_Inspections_Inspector] FOREIGN KEY ([InspectorId]) REFERENCES [Inspectors] ([Id]),
    CONSTRAINT [FK_Inspections_Ticket] FOREIGN KEY ([TicketPurchaseId]) REFERENCES [TicketPurchases] ([Id]),
    CONSTRAINT [FK_Inspections_Vessel] FOREIGN KEY ([VesselId]) REFERENCES [Vessels] ([Id])
);

CREATE TABLE [Violations] (
    [Id] int NOT NULL IDENTITY,
    [InspectionId] int NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [FineAmount] decimal(10,2) NOT NULL,
    CONSTRAINT [PK__Violatio__3214EC07469064E3] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Violations_Inspection] FOREIGN KEY ([InspectionId]) REFERENCES [Inspections] ([Id])
);

CREATE INDEX [IX_BatchLocations_BatchId] ON [BatchLocations] ([BatchId]);

CREATE INDEX [IX_Catches_OperationId] ON [Catches] ([OperationId]);

CREATE INDEX [IX_Catches_SpeciesId] ON [Catches] ([SpeciesId]);

CREATE UNIQUE INDEX [UQ__EngineTy__D4E7DFA885E27956] ON [EngineTypes] ([TypeName]);

CREATE INDEX [IX_FishBatches_BatchCode] ON [FishBatches] ([BatchCode]);

CREATE INDEX [IX_FishBatches_LandingId] ON [FishBatches] ([LandingId]);

CREATE INDEX [IX_FishBatches_SpeciesId] ON [FishBatches] ([SpeciesId]);

CREATE UNIQUE INDEX [UQ__FishBatc__B22ADA8E3830D45A] ON [FishBatches] ([BatchCode]);

CREATE INDEX [IX_FishingGears_GearTypeId] ON [FishingGears] ([GearTypeId]);

CREATE UNIQUE INDEX [UQ__FishingG__D4E7DFA8723FC1DD] ON [FishingGearTypes] ([TypeName]);

CREATE INDEX [IX_FishingOperations_FishingGearId] ON [FishingOperations] ([FishingGearId]);

CREATE INDEX [IX_FishingOps_TripId] ON [FishingOperations] ([TripId]);

CREATE INDEX [IX_FishingPermits_ValidUntil] ON [FishingPermits] ([ValidUntil]);

CREATE INDEX [IX_FishingPermits_VesselId] ON [FishingPermits] ([VesselId]);

CREATE UNIQUE INDEX [UQ__FishingP__DA3C94EED997A6A2] ON [FishingPermits] ([PermitNumber]);

CREATE INDEX [IX_FishingTrips_DepartureDateTime] ON [FishingTrips] ([DepartureDateTime]);

CREATE INDEX [IX_FishingTrips_PermitId] ON [FishingTrips] ([PermitId]);

CREATE INDEX [IX_FishingTrips_VesselId] ON [FishingTrips] ([VesselId]);

CREATE UNIQUE INDEX [UQ__FishSpec__304D4C0DADCFB3B4] ON [FishSpecies] ([SpeciesName]);

CREATE INDEX [IX_Inspections_BatchId] ON [Inspections] ([BatchId]);

CREATE INDEX [IX_Inspections_DateTime] ON [Inspections] ([InspectionDateTime]);

CREATE INDEX [IX_Inspections_InspectorId] ON [Inspections] ([InspectorId]);

CREATE INDEX [IX_Inspections_TicketPurchaseId] ON [Inspections] ([TicketPurchaseId]);

CREATE INDEX [IX_Inspections_VesselId] ON [Inspections] ([VesselId]);

CREATE UNIQUE INDEX [UQ__Inspecto__AA2FFBE4708C57E8] ON [Inspectors] ([PersonId]);

CREATE UNIQUE INDEX [UQ__Inspecto__D110FD567045C85D] ON [Inspectors] ([BadgeNumber]);

CREATE INDEX [IX_Landings_TripId] ON [Landings] ([TripId]);

CREATE INDEX [IX_PermitFishingGears_FishingGearId] ON [PermitFishingGears] ([FishingGearId]);

CREATE INDEX [IX_Persons_EGN] ON [Persons] ([EGN]);

CREATE INDEX [IX_Persons_LastName] ON [Persons] ([LastName], [FirstName]);

CREATE UNIQUE INDEX [UQ__Persons__C1902746ECAE8216] ON [Persons] ([EGN]) WHERE [EGN] IS NOT NULL;

CREATE INDEX [IX_RecCatches_CatchDateTime] ON [RecreationalCatches] ([CatchDateTime]);

CREATE INDEX [IX_RecCatches_PersonId] ON [RecreationalCatches] ([PersonId]);

CREATE INDEX [IX_RecreationalCatches_SpeciesId] ON [RecreationalCatches] ([SpeciesId]);

CREATE INDEX [IX_RecreationalCatches_TicketPurchaseId] ON [RecreationalCatches] ([TicketPurchaseId]);

CREATE INDEX [IX_TELK_PersonId] ON [TELKDecisions] ([PersonId]);

CREATE UNIQUE INDEX [UQ__TELKDeci__BB11758214FDB233] ON [TELKDecisions] ([DecisionNumber]);

CREATE INDEX [IX_TicketPurchases_PersonId] ON [TicketPurchases] ([PersonId]);

CREATE INDEX [IX_TicketPurchases_TELKDecisionId] ON [TicketPurchases] ([TELKDecisionId]);

CREATE INDEX [IX_TicketPurchases_TicketTypeId] ON [TicketPurchases] ([TicketTypeId]);

CREATE UNIQUE INDEX [UQ__TicketPu__CBED06DA55E2E47D] ON [TicketPurchases] ([TicketNumber]);

CREATE UNIQUE INDEX [UQ__TicketTy__D4E7DFA8A7EDAD5F] ON [TicketTypes] ([TypeName]);

CREATE INDEX [IX_Users_PersonId] ON [Users] ([PersonId]);

CREATE INDEX [IX_Vessels_CaptainId] ON [Vessels] ([CaptainId]);

CREATE INDEX [IX_Vessels_EngineTypeId] ON [Vessels] ([EngineTypeId]);

CREATE INDEX [IX_Vessels_InternationalNumber] ON [Vessels] ([InternationalNumber]);

CREATE INDEX [IX_Vessels_Owner] ON [Vessels] ([OwnerId]);

CREATE UNIQUE INDEX [UQ__Vessels__0D0EED16EF482DAE] ON [Vessels] ([InternationalNumber]);

CREATE INDEX [IX_Violations_InspectionId] ON [Violations] ([InspectionId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251201213855_CreateUsers', N'9.0.11');

ALTER TABLE [Users] DROP CONSTRAINT [FK_Users_Persons_PersonId];

ALTER TABLE [Users] DROP CONSTRAINT [PK_Users];

EXEC sp_rename N'[Users]', N'AspNetUsers', 'OBJECT';

EXEC sp_rename N'[AspNetUsers].[Username]', N'UserName', 'COLUMN';

EXEC sp_rename N'[AspNetUsers].[IX_Users_PersonId]', N'IX_AspNetUsers_PersonId', 'INDEX';

DECLARE @var sysname;
SELECT @var = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AspNetUsers]') AND [c].[name] = N'UserId');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [AspNetUsers] DROP CONSTRAINT [' + @var + '];');
ALTER TABLE [AspNetUsers] DROP COLUMN [UserId];

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AspNetUsers]') AND [c].[name] = N'Username');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [AspNetUsers] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [AspNetUsers] DROP COLUMN [Username];

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AspNetUsers]') AND [c].[name] = N'PasswordHash');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [AspNetUsers] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [AspNetUsers] ALTER COLUMN [PasswordHash] nvarchar(max) NULL;

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AspNetUsers]') AND [c].[name] = N'Email');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [AspNetUsers] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [AspNetUsers] ALTER COLUMN [Email] nvarchar(256) NULL;

ALTER TABLE [AspNetUsers] ADD [AccessFailedCount] int NOT NULL DEFAULT 0;

ALTER TABLE [AspNetUsers] ADD [UserName] nvarchar(256) NULL;

ALTER TABLE [AspNetUsers] ADD [Id] nvarchar(450) NOT NULL DEFAULT N'';

ALTER TABLE [AspNetUsers] ADD [ConcurrencyStamp] nvarchar(max) NULL;

ALTER TABLE [AspNetUsers] ADD [EmailConfirmed] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [AspNetUsers] ADD [LockoutEnabled] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [AspNetUsers] ADD [LockoutEnd] datetimeoffset NULL;

ALTER TABLE [AspNetUsers] ADD [NormalizedEmail] nvarchar(256) NULL;

ALTER TABLE [AspNetUsers] ADD [NormalizedUserName] nvarchar(256) NULL;

ALTER TABLE [AspNetUsers] ADD [PhoneNumber] nvarchar(max) NULL;

ALTER TABLE [AspNetUsers] ADD [PhoneNumberConfirmed] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [AspNetUsers] ADD [SecurityStamp] nvarchar(max) NULL;

ALTER TABLE [AspNetUsers] ADD [TwoFactorEnabled] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [AspNetUsers] ADD CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id]);

CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);

ALTER TABLE [AspNetUsers] ADD CONSTRAINT [FK_AspNetUsers_Persons_PersonId] FOREIGN KEY ([PersonId]) REFERENCES [Persons] ([Id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251205072301_AuthenticationMigration', N'9.0.11');

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'TypeName', N'ValidityDays', N'PriceUnder14', N'PriceAdult', N'PricePensioner', N'IsFreeForDisabled') AND [object_id] = OBJECT_ID(N'[TicketTypes]'))
    SET IDENTITY_INSERT [TicketTypes] ON;
INSERT INTO [TicketTypes] ([TypeName], [ValidityDays], [PriceUnder14], [PriceAdult], [PricePensioner], [IsFreeForDisabled])
VALUES (N'Daily Ticket', 1, 5.0, 15.0, 10.0, CAST(1 AS bit)),
(N'Weekly Ticket', 7, 15.0, 30.0, 20.0, CAST(1 AS bit)),
(N'Monthly Ticket', 30, 30.0, 60.0, 40.0, CAST(1 AS bit)),
(N'Annual Ticket', 365, 100.0, 200.0, 150.0, CAST(1 AS bit));
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'TypeName', N'ValidityDays', N'PriceUnder14', N'PriceAdult', N'PricePensioner', N'IsFreeForDisabled') AND [object_id] = OBJECT_ID(N'[TicketTypes]'))
    SET IDENTITY_INSERT [TicketTypes] OFF;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260103211624_SeedTicketTypes', N'9.0.11');

ALTER TABLE [Vessels] ADD [Draft] decimal(6,2) NOT NULL DEFAULT 0.0;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260105213242_AddDraftToVessel', N'9.0.11');

ALTER TABLE [Violations] ADD [IsPaid] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [Violations] ADD [PaidDate] datetime2 NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260105222331_AddPaymentTrackingToViolation', N'9.0.11');

ALTER TABLE [Landings] ADD [TotalWeightKg] decimal(10,2) NOT NULL DEFAULT 0.0;

ALTER TABLE [FishBatches] ADD [Quantity] int NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260111002034_AddTotalWeightKgToLandingAndQuantityToFishBatch', N'9.0.11');

ALTER TABLE [Inspections] ADD [Location] nvarchar(200) NULL;

ALTER TABLE [Inspections] ADD [Observations] nvarchar(1000) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260111010116_AddLocationAndObservationsToInspection', N'9.0.11');

ALTER TABLE [Violations] ADD [ViolationType] nvarchar(100) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260111010800_AddViolationTypeToViolation', N'9.0.11');

COMMIT;
GO

