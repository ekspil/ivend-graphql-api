"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable("controller_pulses", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            controller_id: {
                type: Sequelize.BIGINT,
            },
            a: {
                type: Sequelize.BIGINT,
            },
            b: {
                type: Sequelize.BIGINT,
            },
            c: {
                type: Sequelize.BIGINT,
            },
            o: {
                type: Sequelize.BIGINT,
            },
            t: {
                type: Sequelize.BIGINT,
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
