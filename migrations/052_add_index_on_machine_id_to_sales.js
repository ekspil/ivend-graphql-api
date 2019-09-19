"use strict"

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.addIndex("sales",
            {
                fields: ["machine_id"],
                concurrently:true
            }
        )
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
