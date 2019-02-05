const { Table } = require("typeorm")

const tableName = `sales`

class CreateSale_1549025045086 {

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
                    name: "button_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "item_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "item_matrix_id",
                    type: "int",
                    isNullable: false
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
        await queryRunner.dropTable(tableName)
    }

}

module.exports = CreateSale_1549025045086
