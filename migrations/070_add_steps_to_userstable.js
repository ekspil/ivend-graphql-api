"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("users", "auto_send",
            {
                type: Sequelize.TEXT
            })
        await queryInterface.addColumn("users", "step",
            {
                type: Sequelize.TEXT
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}

