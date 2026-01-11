using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IARA.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLocationAndObservationsToInspection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Inspections",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Observations",
                table: "Inspections",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Inspections");

            migrationBuilder.DropColumn(
                name: "Observations",
                table: "Inspections");
        }
    }
}
