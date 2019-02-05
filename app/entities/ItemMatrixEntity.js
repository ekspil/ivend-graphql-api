const {EntitySchema} = require("typeorm")

const ItemMatrix = require("../models/ItemMatrix")

module.exports = new EntitySchema({
    name: `ItemMatrix`,
    tableName: `item_matrixes`,
    target: ItemMatrix,
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        }
    },
    relations: {
        buttons: {
            target: "ButtonItem",
            type: "one-to-many",
            joinColumn: true
        },
        user: {
            target: "User",
            type: "one-to-one",
            joinColumn: {
                name: "user_id",
                referencedColumnName: "id"
            },
            eager: true
        }
    }
})
