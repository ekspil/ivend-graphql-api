"use strict"

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.removeColumn("controllers", "equipment_id")
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
