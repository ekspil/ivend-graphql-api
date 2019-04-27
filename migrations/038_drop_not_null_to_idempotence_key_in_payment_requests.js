"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn("idempotence_key", "payment_requests", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: true
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
