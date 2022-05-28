"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("controller_pulses", "d",
            {
                type: Sequelize.BIGINT
            })
        await queryInterface.addColumn("controller_pulses", "e",
            {
                type: Sequelize.BIGINT
            })
        await queryInterface.addColumn("controller_pulses", "f",
            {
                type: Sequelize.BIGINT
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
