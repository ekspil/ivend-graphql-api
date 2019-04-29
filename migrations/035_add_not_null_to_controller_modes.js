"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn("controllers", "read_stat_mode", {
            type: Sequelize.TEXT,
            allowNull: false
        })

        await queryInterface.changeColumn("controllers", "bank_terminal_mode", {
            type: Sequelize.TEXT,
            allowNull: false
        })

        await queryInterface.changeColumn("controllers", "fiscalization_mode", {
            type: Sequelize.TEXT,
            allowNull: false
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
