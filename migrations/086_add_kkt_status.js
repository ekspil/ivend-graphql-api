"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("kkts", "status", Sequelize.INTEGER)

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
