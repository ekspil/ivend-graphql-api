const {MigrationInterface, QueryRunner, Table, TableColumn} = require("typeorm");

const tableName = `controllers`;

class AddUserColumnToController_1546799900517 {

    async up(queryRunner) {
        await queryRunner.addColumn(tableName, new TableColumn({
            name: "user_id",
            type: "int"
        }))
    }

    async down(queryRunner) {
        await queryRunner.dropColumn(tableName, 'user_id');
    }

}

module.exports = AddUserColumnToController_1546799900517
