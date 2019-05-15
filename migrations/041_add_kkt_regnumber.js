"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("kkts", "kktRegNumber", Sequelize.TEXT)
        await queryInterface.changeColumn("kkts", "kktFNNumber", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: true
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
