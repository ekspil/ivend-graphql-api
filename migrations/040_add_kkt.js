"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable("machine_types", {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            kktModel: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            inn: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            companyName: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            kktFactoryNumber: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            kktFNNumber: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            kktActivationDate: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            kktBillsCount: {
                type: Sequelize.BIGINT,
                allowNull: true
            },
            kktOFDRegKey: {
                type: Sequelize.TEXT,
                allowNull: true,
                unique: false
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: true
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

        await queryInterface.addColumn("users", "fiscal",
            {
                type: Sequelize.BOOLEAN
            })

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
