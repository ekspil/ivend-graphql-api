"use strict"

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.removeColumn("sales", "controller_id")
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
