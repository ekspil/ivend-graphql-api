"use strict"

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert("revisions", [{
            name: "1",
            created_at: new Date(),
            updated_at: new Date()
        }])
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
