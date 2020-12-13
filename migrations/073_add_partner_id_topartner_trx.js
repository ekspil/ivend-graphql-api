"use strict"


module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.addColumn("partner_fee", "partner_id",
            {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
            })

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}

