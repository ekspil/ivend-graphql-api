"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("bank_payments", "amount",
            {
                type: Sequelize.DECIMAL,
                defaultValue: 0,
                allowNull: false,
                unique: false
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
