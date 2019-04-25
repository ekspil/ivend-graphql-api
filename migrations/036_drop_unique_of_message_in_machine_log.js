"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn("machine_logs", "message",
            {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
