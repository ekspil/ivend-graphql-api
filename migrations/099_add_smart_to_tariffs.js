"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("tariffs", "user_id",
            {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: false
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
