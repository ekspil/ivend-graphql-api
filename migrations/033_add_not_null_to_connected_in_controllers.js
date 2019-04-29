"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn("machine_logs", "type", {
            type: Sequelize.TEXT,
            allowNull: false
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
