"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("machines", "machine_group2_id",
            {
                type: Sequelize.BIGINT,
                allowNull: true,
                unique: false
            })
        await queryInterface.addColumn("machines", "machine_group3_id",
            {
                type: Sequelize.BIGINT,
                allowNull: true,
                unique: false
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
