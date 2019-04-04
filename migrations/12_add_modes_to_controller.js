"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("controllers", "read_stat_mode",
            {
                type: Sequelize.TEXT
            })

        await queryInterface.addColumn("controllers", "bank_terminal_mode",
            {
                type: Sequelize.TEXT
            })

        await queryInterface.addColumn("controllers", "fiscalization_mode",
            {
                type: Sequelize.TEXT
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
