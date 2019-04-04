"use strict"

module.exports = {
    up: async (queryInterface,) => {

        await queryInterface.addIndex(
            "machines",
            ["controller_id"],
            {
                indexName: "controllers_controller_id_key",
                indicesType: "UNIQUE"
            }
        )
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
