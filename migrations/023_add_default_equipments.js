"use strict"

module.exports = {
    up: async (queryInterface) => {
        const defaultEquipments = [
            "Necta Kikko Max",
            "Necta Snakky Max",
            "Дельта",
            "iRest",
            "Качалка",
            "Хватайка"
        ]

        await queryInterface.bulkInsert("equipments", defaultEquipments.map(equipment => ({
            name: equipment,
            created_at: new Date(),
            updated_at: new Date()
        })))
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
