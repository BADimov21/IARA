using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IARA.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddViolationTypeToViolation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ViolationType",
                table: "Violations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ViolationType",
                table: "Violations");
        }
    }
}
