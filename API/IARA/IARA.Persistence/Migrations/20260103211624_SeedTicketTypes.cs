using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IARA.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedTicketTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Seed Ticket Types for Recreational Fishing
            migrationBuilder.InsertData(
                table: "TicketTypes",
                columns: new[] { "TypeName", "ValidityDays", "PriceUnder14", "PriceAdult", "PricePensioner", "IsFreeForDisabled" },
                values: new object[,]
                {
                    { "Daily Ticket", 1, 5m, 15m, 10m, true },
                    { "Weekly Ticket", 7, 15m, 30m, 20m, true },
                    { "Monthly Ticket", 30, 30m, 60m, 40m, true },
                    { "Annual Ticket", 365, 100m, 200m, 150m, true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove seeded ticket types
            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "TypeName",
                keyValues: new object[] { "Daily Ticket", "Weekly Ticket", "Monthly Ticket", "Annual Ticket" });
        }
    }
}
