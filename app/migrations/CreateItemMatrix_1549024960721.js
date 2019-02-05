const { Table } = require("typeorm")

const tableName = `item_matrixes`

class CreateItemMatrix_1549024960721 {

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
                    name: "user_id",
                    type: "int",
                }
            ]
        }), true)
    }

    async down(queryRunner) {
        await queryRunner.dropTable(tableName)
    }

}

module.exports = CreateItemMatrix_1549024960721
