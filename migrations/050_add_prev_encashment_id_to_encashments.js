"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("encashments", "prev_encashment_id",
            {
                type: Sequelize.INTEGER,
                allowNull: true
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
