"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("encashments", "cashless",
            {
                type: Sequelize.DECIMAL
            })
        await queryInterface.addColumn("encashments", "count",
            {
                type: Sequelize.BIGINT
            })
        await queryInterface.addColumn("encashments", "meta",
            {
                type: Sequelize.TEXT
            })
        await queryInterface.addColumn("encashments", "count_cashless",
            {
                type: Sequelize.BIGINT
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
