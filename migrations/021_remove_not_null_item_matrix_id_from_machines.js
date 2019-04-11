"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn("machines", "item_matrix_id", {
            type: Sequelize.BIGINT,
            allowNull: true,
            unique: true
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
