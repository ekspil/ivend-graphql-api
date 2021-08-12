"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("kkts", "type", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        })
        await queryInterface.addColumn("kkts", "rekassa_password", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        })
        await queryInterface.addColumn("kkts", "rekassa_number", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        })
        await queryInterface.addColumn("kkts", "rekassa_kkt_id", {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}

