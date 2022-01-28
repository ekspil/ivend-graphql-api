"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable("sims", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            user_id: {
                type: Sequelize.BIGINT,
            },
            controller_id: {
                type: Sequelize.BIGINT,
            },
            terminal_id: {
                type: Sequelize.BIGINT,
            },
            number: {
                type: Sequelize.TEXT,
            },
            phone: {
                type: Sequelize.TEXT,
            },
            imsi: {
                type: Sequelize.TEXT,
            },
            balance: {
                type: Sequelize.DECIMAL,
            },
            traffic: {
                type: Sequelize.DECIMAL,
            },
            expense: {
                type: Sequelize.DECIMAL,
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
