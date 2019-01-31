const {Table} = require("typeorm")

const tableName = `controller_states`

class CreateControllerStates_1548951696291 {

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
                    name: "coinAcceptorStatus",
                    type: "varchar",
                    isNullable: false

                },
                {
                    name: "billAcceptorStatus",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "coinAmount",
                    type: "decimal",
                    isNullable: false
                },
                {
                    name: "billAmount",
                    type: "decimal",
                    isNullable: false
                },
                {
                    name: "dex1Status",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "dex2Status",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "exeStatus",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "mdbStatus",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "signalStrength",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "registrationTime",
                    type: "time",
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

module.exports = CreateControllerStates_1548951696291
