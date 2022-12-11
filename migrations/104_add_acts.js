"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable("acts", {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            sum: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            meta: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false
            },
            timestamp: {
                type: Sequelize.DATE,
                allowNull: true
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
