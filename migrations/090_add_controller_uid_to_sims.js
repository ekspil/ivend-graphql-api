"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("sims", "controller_uid", Sequelize.TEXT)

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
