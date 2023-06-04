using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class RenameSessionTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SessionMetadata_Projects_ProjectId",
                table: "SessionMetadata");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SessionMetadata",
                table: "SessionMetadata");

            migrationBuilder.RenameTable(
                name: "SessionMetadata",
                newName: "Sessions");

            migrationBuilder.RenameIndex(
                name: "IX_SessionMetadata_ProjectId",
                table: "Sessions",
                newName: "IX_Sessions_ProjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Sessions",
                table: "Sessions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Projects_ProjectId",
                table: "Sessions",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Projects_ProjectId",
                table: "Sessions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Sessions",
                table: "Sessions");

            migrationBuilder.RenameTable(
                name: "Sessions",
                newName: "SessionMetadata");

            migrationBuilder.RenameIndex(
                name: "IX_Sessions_ProjectId",
                table: "SessionMetadata",
                newName: "IX_SessionMetadata_ProjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SessionMetadata",
                table: "SessionMetadata",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SessionMetadata_Projects_ProjectId",
                table: "SessionMetadata",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
