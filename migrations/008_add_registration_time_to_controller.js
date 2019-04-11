"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("controllers", "registration_time", Sequelize.DATE)
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
