const { Table } = require("typeorm")

const tableName = `controllers`

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
                },
                {
                    name: "mode",
                    type: "varchar"
                },
                {
                    name: "accessKey",
                    type: "varchar",
                    isNullable: true
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable(tableName)
    }

}

module.exports = CreateController_1544871592978
