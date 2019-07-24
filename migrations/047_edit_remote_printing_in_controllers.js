"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn("controllers", "remote_printing", "remote_printer_id")

        await queryInterface.changeColumn("controllers", "remote_printer_id", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        })

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}

