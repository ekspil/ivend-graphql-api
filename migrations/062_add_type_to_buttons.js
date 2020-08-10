"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {


        await queryInterface.addColumn("button_items", "type",
            {
                type: Sequelize.STRING,
                defaultValue: "commodity",
                allowNull: false,
            })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
