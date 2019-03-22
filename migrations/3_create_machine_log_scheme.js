"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        // MachineLogs
        await queryInterface.createTable("machine_logs", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            type: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            time: {
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
            }
        })

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
