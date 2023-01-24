"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("controllers", "auto_set_up",
            {
                type: Sequelize.BOOLEAN
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
