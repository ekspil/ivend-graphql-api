const { EntitySchema } = require("typeorm")

const Controller = require("../models/Controller")

module.exports = new EntitySchema({
    name: `Controller`,
    tableName: `controllers`,
    target: Controller,
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        uid: {
            type: "varchar"
        },
        mode: {
            type: "varchar"
        },
        accessKey: {
            type: "varchar",
            nullable: true
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
