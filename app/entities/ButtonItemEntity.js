const { EntitySchema } = require("typeorm")

const ButtonItem = require("../models/ButtonItem")

module.exports = new EntitySchema({
    name: `ButtonItem`,
    tableName: `button_items`,
    target: ButtonItem,
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        buttonId: {
            type: "int"
        },
    },
    relations: {
        itemMatrix: {
            target: "ItemMatrix",
            type: "one-to-one",
            joinColumn: {
                name: "item_matrix_id",
                referencedColumnName: "id"
            },
            eager: true
        },
        item: {
            target: "Item",
            type: "one-to-one",
            joinColumn: {
                name: "item_id",
                referencedColumnName: "id"
            },
            eager: true
        }
    }
})
