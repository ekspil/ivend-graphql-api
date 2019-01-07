const {MigrationInterface, QueryRunner, Table} = require("typeorm");

const tableName = `controller_errors`;

class CreateControllerErrors_1546796166078 {

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
                    name: "message",
                    type: "text",
                },
                {
                    name: "controller_id",
                    type: "int",
                    isNullable: false
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable(tableName);
    }

}

module.exports = CreateControllerErrors_1546796166078
