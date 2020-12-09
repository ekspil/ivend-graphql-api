"use strict"


module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn("users", "partner_id",
            {
                type: Sequelize.BIGINT
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}

