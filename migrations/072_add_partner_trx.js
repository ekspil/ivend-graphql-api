"use strict"


module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable("partner_fees", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            controller_fee: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: false
            },
            terminal_fee: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: false
            },
            kkm_fee: {
                type: Sequelize.DECIMAL,
                allowNull: false,
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
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "users",
                    key: "id"
                }
            }
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}

