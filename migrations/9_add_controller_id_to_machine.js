"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("machines", "controller_id",
            {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: true,
                defaultValue: 0
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
