const {MigrationInterface, QueryRunner, Table} = require("typeorm");

const tableName = `permissions`;

class CreatePermission_1544948265057 {

    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: tableName,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true
                },
                {
                    name: "name",
                    type: "varchar",
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable(tableName);
    }

}

module.exports = CreatePermission_1544948265057
