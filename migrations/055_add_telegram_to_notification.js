"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("notification_settings", "telegram", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        })
        await queryInterface.addColumn("notification_settings", "telegramChat", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
