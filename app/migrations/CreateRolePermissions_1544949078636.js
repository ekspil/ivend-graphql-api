const {MigrationInterface, QueryRunner, Table} = require("typeorm");

const tableName = `role_permissions`;

class CreateRolePermissions_1544949078636 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: tableName,
            columns: [
                {
                    name: "role_id",
                    type: "int",
                },
                {
                    name: "name",
                    type: "varchar"
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable(tableName);
    }

}

module.exports = CreateRolePermissions_1544949078636
