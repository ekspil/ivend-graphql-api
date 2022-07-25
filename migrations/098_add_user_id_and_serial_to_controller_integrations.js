"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("controller_integrations", "user_id",
            {
                type: Sequelize.BIGINT
            })
        await queryInterface.addColumn("controller_integrations", "serial",
            {
                type: Sequelize.TEXT
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
