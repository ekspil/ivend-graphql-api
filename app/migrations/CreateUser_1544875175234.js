const {MigrationInterface, QueryRunner, Table} = require("typeorm");

const tableName = `users`;

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
                    name: "email",
                    type: "varchar",
                    isUnique: true
                },
                {
                    name: "passwordHash",
                    type: "varchar",
                },
                {
                    name: "phone",
                    type: "varchar",
                    isNullable: true
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable(tableName);
    }

}

module.exports = CreateController_1544871592978
