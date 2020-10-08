"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable("temp_machines", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            amount: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: false
            },
            meta: {
                type: Sequelize.TEXT,
                unique: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            machine_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "machines",
                    key: "id"
                }
            }
        })

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
