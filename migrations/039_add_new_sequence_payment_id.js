"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query("CREATE SEQUENCE payment_id_seq", {
            type: Sequelize.QueryTypes.SELECT
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
