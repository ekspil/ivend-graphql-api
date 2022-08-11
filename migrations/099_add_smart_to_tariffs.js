"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("tariffs", "smart",
            {
                type: Sequelize.DECIMAL,
                defaultValue: 150,
                allowNull: false,
                unique: false
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
