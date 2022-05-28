"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("controller_pulses", "d", Sequelize.BIGINT)
        await queryInterface.addColumn("controller_pulses", "e", Sequelize.BIGINT)
        await queryInterface.addColumn("controller_pulses", "f", Sequelize.BIGINT)
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
