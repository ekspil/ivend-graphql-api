"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("users", "company_name",
            {
                type: Sequelize.TEXT
            })
        await queryInterface.addColumn("users", "inn",
            {
                type: Sequelize.TEXT
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
