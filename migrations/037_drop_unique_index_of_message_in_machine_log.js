"use strict"

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.removeConstraint("machine_logs", "machine_logs_message_key")
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
