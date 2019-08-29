"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("sales", "receipt_id", {
            type: Sequelize.TEXT,
            allowNull: true
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
