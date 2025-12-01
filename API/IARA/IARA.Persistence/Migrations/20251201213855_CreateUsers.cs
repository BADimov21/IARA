using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IARA.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreateUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EngineTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AverageFuelConsumption = table.Column<decimal>(type: "decimal(6,2)", nullable: false),
                    FuelUnit = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__EngineTy__3214EC07F3BAB40A", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FishingGearTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FishingG__3214EC072E68112E", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FishSpecies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpeciesName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FishSpec__3214EC07845DB5B2", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Persons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MiddleName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EGN = table.Column<string>(type: "char(10)", unicode: false, fixedLength: true, maxLength: 10, nullable: true),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Persons__3214EC07AF20FDAD", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TicketTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ValidityDays = table.Column<int>(type: "int", nullable: false),
                    PriceUnder14 = table.Column<decimal>(type: "decimal(8,2)", nullable: false),
                    PriceAdult = table.Column<decimal>(type: "decimal(8,2)", nullable: false),
                    PricePensioner = table.Column<decimal>(type: "decimal(8,2)", nullable: false),
                    IsFreeForDisabled = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TicketTy__3214EC077D6B8F05", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FishingGears",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GearTypeId = table.Column<int>(type: "int", nullable: false),
                    MeshSize = table.Column<int>(type: "int", nullable: true),
                    Length = table.Column<decimal>(type: "decimal(8,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FishingG__3214EC070D3BD345", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FishingGears_Type",
                        column: x => x.GearTypeId,
                        principalTable: "FishingGearTypes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Inspectors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonId = table.Column<int>(type: "int", nullable: false),
                    BadgeNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Inspecto__3214EC071830EEF4", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inspectors_Person",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TELKDecisions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonId = table.Column<int>(type: "int", nullable: false),
                    DecisionNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IssueDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ValidUntil = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TELKDeci__3214EC07FDF32121", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TELK_Person",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    UserType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PersonId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastLoginDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Users_Persons_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Vessels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InternationalNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CallSign = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    VesselName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Length = table.Column<decimal>(type: "decimal(6,2)", nullable: false),
                    Width = table.Column<decimal>(type: "decimal(6,2)", nullable: false),
                    GrossTonnage = table.Column<decimal>(type: "decimal(8,2)", nullable: false),
                    EnginePower = table.Column<decimal>(type: "decimal(8,2)", nullable: false),
                    EngineTypeId = table.Column<int>(type: "int", nullable: false),
                    OwnerId = table.Column<int>(type: "int", nullable: false),
                    CaptainId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Vessels__3214EC07203BA2D7", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vessels_Captain",
                        column: x => x.CaptainId,
                        principalTable: "Persons",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Vessels_EngineType",
                        column: x => x.EngineTypeId,
                        principalTable: "EngineTypes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Vessels_Owner",
                        column: x => x.OwnerId,
                        principalTable: "Persons",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TicketPurchases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TicketNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TicketTypeId = table.Column<int>(type: "int", nullable: false),
                    PersonId = table.Column<int>(type: "int", nullable: false),
                    PurchaseDate = table.Column<DateOnly>(type: "date", nullable: false, defaultValueSql: "(CONVERT([date],getdate()))"),
                    ValidFrom = table.Column<DateOnly>(type: "date", nullable: false),
                    ValidUntil = table.Column<DateOnly>(type: "date", nullable: false),
                    PricePaid = table.Column<decimal>(type: "decimal(8,2)", nullable: false),
                    TELKDecisionId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TicketPu__3214EC0714114533", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TicketPurchases_Person",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TicketPurchases_TELK",
                        column: x => x.TELKDecisionId,
                        principalTable: "TELKDecisions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TicketPurchases_Type",
                        column: x => x.TicketTypeId,
                        principalTable: "TicketTypes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FishingPermits",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PermitNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    VesselId = table.Column<int>(type: "int", nullable: false),
                    IssueDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ValidFrom = table.Column<DateOnly>(type: "date", nullable: false),
                    ValidUntil = table.Column<DateOnly>(type: "date", nullable: false),
                    IsRevoked = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FishingP__3214EC0761E55F54", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FishingPermits_Vessel",
                        column: x => x.VesselId,
                        principalTable: "Vessels",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "RecreationalCatches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TicketPurchaseId = table.Column<int>(type: "int", nullable: false),
                    PersonId = table.Column<int>(type: "int", nullable: false),
                    SpeciesId = table.Column<int>(type: "int", nullable: false),
                    CatchDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    WeightKg = table.Column<decimal>(type: "decimal(8,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Recreati__3214EC0763B75942", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecCatches_Person",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RecCatches_Species",
                        column: x => x.SpeciesId,
                        principalTable: "FishSpecies",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RecCatches_Ticket",
                        column: x => x.TicketPurchaseId,
                        principalTable: "TicketPurchases",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FishingTrips",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VesselId = table.Column<int>(type: "int", nullable: false),
                    PermitId = table.Column<int>(type: "int", nullable: false),
                    DepartureDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeparturePort = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ArrivalDateTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ArrivalPort = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DurationHours = table.Column<decimal>(type: "numeric(17,6)", nullable: true, computedColumnSql: "(datediff(minute,[DepartureDateTime],isnull([ArrivalDateTime],sysdatetime()))/(60.0))", stored: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FishingT__3214EC07E117A50E", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FishingTrips_Permit",
                        column: x => x.PermitId,
                        principalTable: "FishingPermits",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FishingTrips_Vessel",
                        column: x => x.VesselId,
                        principalTable: "Vessels",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PermitFishingGears",
                columns: table => new
                {
                    PermitId = table.Column<int>(type: "int", nullable: false),
                    FishingGearId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PermitFi__7E72B374CA7502B2", x => new { x.PermitId, x.FishingGearId });
                    table.ForeignKey(
                        name: "FK_PermitGears_Gear",
                        column: x => x.FishingGearId,
                        principalTable: "FishingGears",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PermitGears_Permit",
                        column: x => x.PermitId,
                        principalTable: "FishingPermits",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FishingOperations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TripId = table.Column<int>(type: "int", nullable: false),
                    FishingGearId = table.Column<int>(type: "int", nullable: false),
                    StartDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDateTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FishingO__3214EC075248B5A6", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FishingOps_Gear",
                        column: x => x.FishingGearId,
                        principalTable: "FishingGears",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FishingOps_Trip",
                        column: x => x.TripId,
                        principalTable: "FishingTrips",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Landings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TripId = table.Column<int>(type: "int", nullable: false),
                    LandingDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Port = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Landings__3214EC07C0CFF55A", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Landings_Trip",
                        column: x => x.TripId,
                        principalTable: "FishingTrips",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Catches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OperationId = table.Column<int>(type: "int", nullable: false),
                    SpeciesId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    WeightKg = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Catches__3214EC073BE14AF7", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Catches_Operation",
                        column: x => x.OperationId,
                        principalTable: "FishingOperations",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Catches_Species",
                        column: x => x.SpeciesId,
                        principalTable: "FishSpecies",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FishBatches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LandingId = table.Column<int>(type: "int", nullable: false),
                    SpeciesId = table.Column<int>(type: "int", nullable: false),
                    BatchCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    WeightKg = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FishBatc__3214EC07A14E5831", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FishBatches_Landing",
                        column: x => x.LandingId,
                        principalTable: "Landings",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FishBatches_Species",
                        column: x => x.SpeciesId,
                        principalTable: "FishSpecies",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "BatchLocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BatchId = table.Column<int>(type: "int", nullable: false),
                    LocationType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LocationName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ArrivedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DepartedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BatchLoc__3214EC07D580DB2D", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BatchLocations_Batch",
                        column: x => x.BatchId,
                        principalTable: "FishBatches",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Inspections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InspectorId = table.Column<int>(type: "int", nullable: false),
                    InspectionDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InspectionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    VesselId = table.Column<int>(type: "int", nullable: true),
                    BatchId = table.Column<int>(type: "int", nullable: true),
                    TicketPurchaseId = table.Column<int>(type: "int", nullable: true),
                    IsCompliant = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Inspecti__3214EC07555A727C", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inspections_Batch",
                        column: x => x.BatchId,
                        principalTable: "FishBatches",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Inspections_Inspector",
                        column: x => x.InspectorId,
                        principalTable: "Inspectors",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Inspections_Ticket",
                        column: x => x.TicketPurchaseId,
                        principalTable: "TicketPurchases",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Inspections_Vessel",
                        column: x => x.VesselId,
                        principalTable: "Vessels",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Violations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InspectionId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FineAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Violatio__3214EC07469064E3", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Violations_Inspection",
                        column: x => x.InspectionId,
                        principalTable: "Inspections",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_BatchLocations_BatchId",
                table: "BatchLocations",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Catches_OperationId",
                table: "Catches",
                column: "OperationId");

            migrationBuilder.CreateIndex(
                name: "IX_Catches_SpeciesId",
                table: "Catches",
                column: "SpeciesId");

            migrationBuilder.CreateIndex(
                name: "UQ__EngineTy__D4E7DFA885E27956",
                table: "EngineTypes",
                column: "TypeName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FishBatches_BatchCode",
                table: "FishBatches",
                column: "BatchCode");

            migrationBuilder.CreateIndex(
                name: "IX_FishBatches_LandingId",
                table: "FishBatches",
                column: "LandingId");

            migrationBuilder.CreateIndex(
                name: "IX_FishBatches_SpeciesId",
                table: "FishBatches",
                column: "SpeciesId");

            migrationBuilder.CreateIndex(
                name: "UQ__FishBatc__B22ADA8E3830D45A",
                table: "FishBatches",
                column: "BatchCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FishingGears_GearTypeId",
                table: "FishingGears",
                column: "GearTypeId");

            migrationBuilder.CreateIndex(
                name: "UQ__FishingG__D4E7DFA8723FC1DD",
                table: "FishingGearTypes",
                column: "TypeName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FishingOperations_FishingGearId",
                table: "FishingOperations",
                column: "FishingGearId");

            migrationBuilder.CreateIndex(
                name: "IX_FishingOps_TripId",
                table: "FishingOperations",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_FishingPermits_ValidUntil",
                table: "FishingPermits",
                column: "ValidUntil");

            migrationBuilder.CreateIndex(
                name: "IX_FishingPermits_VesselId",
                table: "FishingPermits",
                column: "VesselId");

            migrationBuilder.CreateIndex(
                name: "UQ__FishingP__DA3C94EED997A6A2",
                table: "FishingPermits",
                column: "PermitNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FishingTrips_DepartureDateTime",
                table: "FishingTrips",
                column: "DepartureDateTime");

            migrationBuilder.CreateIndex(
                name: "IX_FishingTrips_PermitId",
                table: "FishingTrips",
                column: "PermitId");

            migrationBuilder.CreateIndex(
                name: "IX_FishingTrips_VesselId",
                table: "FishingTrips",
                column: "VesselId");

            migrationBuilder.CreateIndex(
                name: "UQ__FishSpec__304D4C0DADCFB3B4",
                table: "FishSpecies",
                column: "SpeciesName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Inspections_BatchId",
                table: "Inspections",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Inspections_DateTime",
                table: "Inspections",
                column: "InspectionDateTime");

            migrationBuilder.CreateIndex(
                name: "IX_Inspections_InspectorId",
                table: "Inspections",
                column: "InspectorId");

            migrationBuilder.CreateIndex(
                name: "IX_Inspections_TicketPurchaseId",
                table: "Inspections",
                column: "TicketPurchaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Inspections_VesselId",
                table: "Inspections",
                column: "VesselId");

            migrationBuilder.CreateIndex(
                name: "UQ__Inspecto__AA2FFBE4708C57E8",
                table: "Inspectors",
                column: "PersonId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Inspecto__D110FD567045C85D",
                table: "Inspectors",
                column: "BadgeNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Landings_TripId",
                table: "Landings",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_PermitFishingGears_FishingGearId",
                table: "PermitFishingGears",
                column: "FishingGearId");

            migrationBuilder.CreateIndex(
                name: "IX_Persons_EGN",
                table: "Persons",
                column: "EGN");

            migrationBuilder.CreateIndex(
                name: "IX_Persons_LastName",
                table: "Persons",
                columns: new[] { "LastName", "FirstName" });

            migrationBuilder.CreateIndex(
                name: "UQ__Persons__C1902746ECAE8216",
                table: "Persons",
                column: "EGN",
                unique: true,
                filter: "[EGN] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_RecCatches_CatchDateTime",
                table: "RecreationalCatches",
                column: "CatchDateTime");

            migrationBuilder.CreateIndex(
                name: "IX_RecCatches_PersonId",
                table: "RecreationalCatches",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_RecreationalCatches_SpeciesId",
                table: "RecreationalCatches",
                column: "SpeciesId");

            migrationBuilder.CreateIndex(
                name: "IX_RecreationalCatches_TicketPurchaseId",
                table: "RecreationalCatches",
                column: "TicketPurchaseId");

            migrationBuilder.CreateIndex(
                name: "IX_TELK_PersonId",
                table: "TELKDecisions",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "UQ__TELKDeci__BB11758214FDB233",
                table: "TELKDecisions",
                column: "DecisionNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketPurchases_PersonId",
                table: "TicketPurchases",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketPurchases_TELKDecisionId",
                table: "TicketPurchases",
                column: "TELKDecisionId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketPurchases_TicketTypeId",
                table: "TicketPurchases",
                column: "TicketTypeId");

            migrationBuilder.CreateIndex(
                name: "UQ__TicketPu__CBED06DA55E2E47D",
                table: "TicketPurchases",
                column: "TicketNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__TicketTy__D4E7DFA8A7EDAD5F",
                table: "TicketTypes",
                column: "TypeName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_PersonId",
                table: "Users",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Vessels_CaptainId",
                table: "Vessels",
                column: "CaptainId");

            migrationBuilder.CreateIndex(
                name: "IX_Vessels_EngineTypeId",
                table: "Vessels",
                column: "EngineTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Vessels_InternationalNumber",
                table: "Vessels",
                column: "InternationalNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Vessels_Owner",
                table: "Vessels",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "UQ__Vessels__0D0EED16EF482DAE",
                table: "Vessels",
                column: "InternationalNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Violations_InspectionId",
                table: "Violations",
                column: "InspectionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BatchLocations");

            migrationBuilder.DropTable(
                name: "Catches");

            migrationBuilder.DropTable(
                name: "PermitFishingGears");

            migrationBuilder.DropTable(
                name: "RecreationalCatches");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Violations");

            migrationBuilder.DropTable(
                name: "FishingOperations");

            migrationBuilder.DropTable(
                name: "Inspections");

            migrationBuilder.DropTable(
                name: "FishingGears");

            migrationBuilder.DropTable(
                name: "FishBatches");

            migrationBuilder.DropTable(
                name: "Inspectors");

            migrationBuilder.DropTable(
                name: "TicketPurchases");

            migrationBuilder.DropTable(
                name: "FishingGearTypes");

            migrationBuilder.DropTable(
                name: "Landings");

            migrationBuilder.DropTable(
                name: "FishSpecies");

            migrationBuilder.DropTable(
                name: "TELKDecisions");

            migrationBuilder.DropTable(
                name: "TicketTypes");

            migrationBuilder.DropTable(
                name: "FishingTrips");

            migrationBuilder.DropTable(
                name: "FishingPermits");

            migrationBuilder.DropTable(
                name: "Vessels");

            migrationBuilder.DropTable(
                name: "Persons");

            migrationBuilder.DropTable(
                name: "EngineTypes");
        }
    }
}
