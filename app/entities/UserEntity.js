const {EntitySchema} = require("typeorm")

const Controller = require("../models/Controller")

module.exports = new EntitySchema({
    name: "User",
    target: Controller,
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        email: {
            type: "varchar",
            unique: true
        },
        passwordHash: {
            type: "varchar"
        },
        phone: {
            type: "varchar",
            nullable: true
        }
    }
});
