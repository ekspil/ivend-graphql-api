"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("controllers", "cashless",
            {
                type: Sequelize.TEXT
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
