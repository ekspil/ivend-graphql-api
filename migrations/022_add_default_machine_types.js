"use strict"

module.exports = {
    up: async (queryInterface) => {
        const defaultTypes = [
            "Кофе",
            "Снек",
            "Газвода",
            "Кресло",
            "Качалка",
            "Кран машина"
        ]

        await queryInterface.bulkInsert("machine_types", defaultTypes.map(type => ({
            name: type,
            created_at: new Date(),
            updated_at: new Date()
        })))
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
