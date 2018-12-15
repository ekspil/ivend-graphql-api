const {EntitySchema} = require("typeorm")

const Controller = require("../models/Controller")

module.exports = new EntitySchema({
    name: "Controller",
    tableName: "controllers",
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
            type: "varchar"
        }
    }
});
