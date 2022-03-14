"use strict"


module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("users", "country_code",
            {
                type: Sequelize.TEXT
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}

