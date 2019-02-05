const {Table} = require("typeorm")

const tableName = `button_items`

class CreateButtonItems_1549193067979 {

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
                    name: "item_matrix_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "buttonId",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "item_id",
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

module.exports = CreateButtonItems_1549193067979
