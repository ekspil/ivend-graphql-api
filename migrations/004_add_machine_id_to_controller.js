"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("controllers", "machine_id", Sequelize.BIGINT)
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
