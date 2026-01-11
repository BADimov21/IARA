using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IARA.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTotalWeightKgToLandingAndQuantityToFishBatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TotalWeightKg",
                table: "Landings",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "FishBatches",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalWeightKg",
                table: "Landings");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "FishBatches");
        }
    }
}
