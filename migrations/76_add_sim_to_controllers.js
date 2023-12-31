"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("controllers", "sim", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        })
        await queryInterface.addColumn("controllers", "imsi_terminal", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
