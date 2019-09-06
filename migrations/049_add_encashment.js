"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable("encashments", {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            machine_id: {
                type: Sequelize.BIGINT,
                allowNull: false
            },
            timestamp: {
                type: Sequelize.DATE,
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
