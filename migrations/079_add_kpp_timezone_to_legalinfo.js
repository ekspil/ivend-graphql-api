"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("legal_infos", "kpp",
            {
                type: Sequelize.STRING,
                allowNull: true
            })
        await queryInterface.addColumn("legal_infos", "time_zone",
            {
                type: Sequelize.STRING,
                allowNull: true
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
