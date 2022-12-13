"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("controller_pulses", "random_commands", Sequelize.TEXT)
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
