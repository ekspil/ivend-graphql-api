"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("temp_machines", "cashless",
            {
                type: Sequelize.DECIMAL
            })
        await queryInterface.addColumn("temp_machines", "count",
            {
                type: Sequelize.BIGINT
            })
        await queryInterface.addColumn("temp_machines", "count_cashless",
            {
                type: Sequelize.BIGINT
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
