"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("temps", "amount_today",
            {
                type: Sequelize.DECIMAL
            })
        await queryInterface.addColumn("temps", "amount_yesterday",
            {
                type: Sequelize.DECIMAL
            })
        await queryInterface.addColumn("temps", "count_today",
            {
                type: Sequelize.BIGINT
            })
        await queryInterface.addColumn("temps", "count_yesterday",
            {
                type: Sequelize.BIGINT
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
