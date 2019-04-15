"use strict"

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert("services", [{
            name: "Telemetry",
            price: 100,
            billing_type: "MONTHLY",
            type: "CONTROLLER",
            created_at: new Date(),
            updated_at: new Date()
        }])
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
