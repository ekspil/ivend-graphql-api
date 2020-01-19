"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("notification_settings", "extraEmail", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        })
        await queryInterface.addColumn("notification_settings", "tlgrm", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            unique: false
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
