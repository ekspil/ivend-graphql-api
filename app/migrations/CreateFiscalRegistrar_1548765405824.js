const { Table } = require("typeorm")

const tableName = `fiscal_registrars`

class CreateFiscalRegistrar_1548765405824 {

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
                    isUnique: true
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable(tableName)
    }

}

module.exports = CreateFiscalRegistrar_1548765405824
