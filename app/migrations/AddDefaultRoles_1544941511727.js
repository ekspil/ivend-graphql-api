const {MigrationInterface, QueryRunner, Table} = require("typeorm");

const tableName = `roles`;

class AddDefaultRoles_1544941511727 {

    async up(queryRunner) {
        await queryRunner
            .manager
            .createQueryBuilder()
            .insert()
            .into(tableName)
            .values([{name: "USER"}])
            .execute()

        await queryRunner
            .manager
            .createQueryBuilder()
            .insert()
            .into(tableName)
            .values([{name: "ADMIN"}])
            .execute()

        await queryRunner
            .manager
            .createQueryBuilder()
            .insert()
            .into(tableName)
            .values([{name: "AGGREGATOR"}])
            .execute()
    }

    async down(queryRunner) {

        await queryRunner
            .manager
            .createQueryBuilder()
            .delete()
            .from(tableName)
            .where("name = :role", {role: "USER"})
            .execute()

        await queryRunner
            .manager
            .createQueryBuilder()
            .delete()
            .from(tableName)
            .where("name = :role", {role: "ADMIN"})
            .execute()

        await queryRunner
            .manager
            .createQueryBuilder()
            .delete()
            .from(tableName)
            .where("name = :role", {role: "AGGREGATOR"})
            .execute()
    }

}

module.exports = AddDefaultRoles_1544941511727
