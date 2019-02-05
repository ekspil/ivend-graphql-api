const {EntitySchema} = require("typeorm")

const Item = require("../models/Item")

module.exports = new EntitySchema({
    name: `Item`,
    tableName: `items`,
    target: Item,
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        name: {
            type: "varchar"
        },
        price: {
            type: "float"
        }
    },
    relations: {
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
