"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("machines", "deleted_at",
            {
                type: Sequelize.DATE,
                allowNull: true
            })
        await queryInterface.addColumn("controllers", "deleted_at",
            {
                type: Sequelize.DATE,
                allowNull: true
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
