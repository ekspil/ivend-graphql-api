"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("button_items", "multiplier",
            {
                type: Sequelize.INTEGER,
                defaultValue: 1,
                allowNull: false,
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
