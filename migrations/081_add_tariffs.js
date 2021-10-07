"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable("tariffs", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            telemetry: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: false
            },
            acquiring: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: false
            },
            fiscal: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: false
            },
            partner_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
            },
            meta: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            started_at: {
                type: Sequelize.DATE,
                allowNull: false
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
