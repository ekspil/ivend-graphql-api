const {MigrationInterface, QueryRunner, Table} = require("typeorm");

const tableName = `controllers`;

class CreateController_1544871592978 {

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
                    name: "uid",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "mode",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "accessKey",
                    type: "varchar",
                    isNullable: false
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable(tableName);
    }

}

module.exports = CreateController_1544871592978
