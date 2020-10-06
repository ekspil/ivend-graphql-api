"use strict"

module.exports = {
    up: async (queryInterface) => {

        await queryInterface.renameTable("temp", "temps")

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
