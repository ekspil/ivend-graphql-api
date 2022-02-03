"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("admin_statistics", "sim_count", Sequelize.BIGINT)
        await queryInterface.addColumn("admin_statistics", "sim_expense", Sequelize.DECIMAL)
        await queryInterface.addColumn("admin_statistics", "sim_traffic", Sequelize.DECIMAL)

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
