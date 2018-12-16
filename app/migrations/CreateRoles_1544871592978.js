const {MigrationInterface, QueryRunner, Table} = require("typeorm");

const tableName = `roles`;

class CreateRoles_1544871592978 {

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

module.exports = CreateRoles_1544871592978
