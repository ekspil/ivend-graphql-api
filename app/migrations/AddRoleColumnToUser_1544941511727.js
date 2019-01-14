const { TableColumn } = require("typeorm")

const tableName = `users`

class AddRoleColumnToUser_1544941511727 {

    async up(queryRunner) {
        await queryRunner.addColumn(tableName, new TableColumn({
            name: "role_id",
            type: "int"
        }))
    }

    async down(queryRunner) {
        await queryRunner.dropColumn(tableName, "role_id")
    }

}

module.exports = AddRoleColumnToUser_1544941511727
