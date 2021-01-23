"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable("admin_statistics", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            billing_amount: {
                type: Sequelize.DECIMAL
            },
            billing_balance: {
                type: Sequelize.DECIMAL
            },
            billing_credit: {
                type: Sequelize.DECIMAL
            },
            controllers_count: {
                type: Sequelize.BIGINT
            },
            controllers_disabled: {
                type: Sequelize.BIGINT
            },
            controllers_disconnected: {
                type: Sequelize.BIGINT
            },
            kkts_count: {
                type: Sequelize.BIGINT
            },
            kkts_normal: {
                type: Sequelize.DataTypes.BIGINT
            },
            kkts_error: {
                type: Sequelize.DataTypes.BIGINT
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
        })

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
