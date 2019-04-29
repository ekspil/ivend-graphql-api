"use strict"

module.exports = {
    up: async (queryInterface,) => {
        await queryInterface.removeColumn("machine_logs", "type")
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}

