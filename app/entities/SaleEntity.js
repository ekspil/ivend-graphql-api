const { EntitySchema } = require("typeorm")

const Sale = require("../models/Sale")

module.exports = new EntitySchema({
    name: `Sale`,
    tableName: `sales`,
    target: Sale,
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        buttonId: {
            name: "button_id",
            type: "int"
        }
    },
    relations: {
        item: {
            target: "Item",
            type: "one-to-one",
            joinColumn: {
                name: "item_id",
                referencedColumnName: "id"
            },
            eager: true
        },
        itemMatrix: {
            target: "ItemMatrix",
            type: "one-to-one",
            joinColumn: {
                name: "item_matrix_id",
                referencedColumnName: "id"
            },
            eager: true
        },
        controller: {
            target: "Controller",
            type: "one-to-one",
            joinColumn: {
                name: "controller_id",
                referencedColumnName: "id"
            },
            eager: true
        }
    }
})
