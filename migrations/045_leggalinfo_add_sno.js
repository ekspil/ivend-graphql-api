"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("legal_infos", "sno", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}

