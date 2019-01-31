const { TableColumn } = require("typeorm")

const tableName = `controllers`

class AddMoreColumnsToController_1548773174036 {

    async up(queryRunner) {
        await queryRunner.addColumn(tableName, new TableColumn({
            name: "name",
            type: "varchar"
        }))
        await queryRunner.addColumn(tableName, new TableColumn({
            name: "equipment_id",
            type: "int",
            isNullable: false,
            isUnique: false
        }))
        await queryRunner.addColumn(tableName, new TableColumn({
            name: "fiscal_registrar_id",
            type: "int",
            isNullable: true,
            isUnique: false
        }))
        await queryRunner.addColumn(tableName, new TableColumn({
            name: "bank_terminal_id",
            type: "int",
            isNullable: true,
            isUnique: false
        }))
        await queryRunner.addColumn(tableName, new TableColumn({
            name: "revision",
            type: "varchar",
            isNullable: false,
            isUnique: false
        }))
        await queryRunner.addColumn(tableName, new TableColumn({
            name: "status",
            type: "varchar",
            isNullable: false,
            isUnique: false
        }))
        await queryRunner.addColumn(tableName, new TableColumn({
            name: "last_state_id",
            type: "int",
            isNullable: true,
            isUnique: true
        }))
    }

    async down(queryRunner) {
        await queryRunner.dropColumn(tableName, "name")
        await queryRunner.dropColumn(tableName, "equipment_id")
        await queryRunner.dropColumn(tableName, "fiscal_registrar_id")
        await queryRunner.dropColumn(tableName, "bank_terminal_id")
        await queryRunner.dropColumn(tableName, "revision")
        await queryRunner.dropColumn(tableName, "status")
    }

}

module.exports = AddMoreColumnsToController_1548773174036
