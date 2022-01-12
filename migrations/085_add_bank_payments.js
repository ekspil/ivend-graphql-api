"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable("bank_payments", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            applied: {
                type: Sequelize.BOOLEAN,
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            meta: {
                type: Sequelize.TEXT,
                allowNull: true,
                unique: false
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
            }
        })

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
