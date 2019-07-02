"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("controllers", "remote_printing", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            unique: false,
            defaultValue: false
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}

