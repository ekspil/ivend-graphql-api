"use strict"

module.exports = {
    up: async (queryInterface,) => {
        await queryInterface.dropTable("bank_terminals")
        await queryInterface.dropTable("fiscal_registrars")
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
