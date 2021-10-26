"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable("partner_infos", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            partner_id: {
                type: Sequelize.BIGINT,
                unique: true,
                allowNull: false
            },
            file_logo: {
                type: Sequelize.TEXT,
                unique: false
            },
            file_oferta: {
                type: Sequelize.TEXT,
                unique: false
            },
            info_phone_tech: {
                type: Sequelize.TEXT,
                unique: false
            },
            info_phone_com: {
                type: Sequelize.TEXT,
                unique: false
            },
            info_requisites: {
                type: Sequelize.TEXT,
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
