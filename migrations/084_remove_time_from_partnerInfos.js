"use strict"

module.exports = {
    up: async (queryInterface,) => {
        await queryInterface.removeColumn("partner_infos", "started_at")
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}

