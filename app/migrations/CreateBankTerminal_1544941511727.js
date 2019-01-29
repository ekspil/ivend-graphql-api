const {Table} = require("typeorm")

const tableName = `bank_terminals`

class CreateBankTerminal_1544941511727 {

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

module.exports = CreateBankTerminal_1544941511727
