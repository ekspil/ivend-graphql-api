const { TableColumn } = require("typeorm")

const tableName = `controllers`

class AddItemMatrixToController_1549371997460 {

    async up(queryRunner) {
        await queryRunner.addColumn(tableName, new TableColumn({
            name: "item_matrix_id",
            type: "int",
            isNullable: false,
            isUnique: true
        }))
    }

    async down(queryRunner) {
        await queryRunner.dropColumn(tableName, "item_matrix_id")
    }

}

module.exports = AddItemMatrixToController_1549371997460
