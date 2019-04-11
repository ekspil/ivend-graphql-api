"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn("machines", "equipment_id", {
            type: Sequelize.BIGINT,
            allowNull: false
        })
        await queryInterface.changeColumn("machines", "machine_group_id", {
            type: Sequelize.BIGINT,
            allowNull: false
        })
        await queryInterface.changeColumn("machines", "machine_type_id", {
            type: Sequelize.BIGINT,
            allowNull: false
        })
        await queryInterface.changeColumn("machines", "item_matrix_id", {
            type: Sequelize.BIGINT,
            allowNull: false
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
