"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("news", "new",
            {
                type: Sequelize.INTEGER,
                defaultValue: 1
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
