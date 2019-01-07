const {EntitySchema} = require("typeorm")

const ControllerError = require("../models/ControllerError")

module.exports = new EntitySchema({
    name: "ControllerError",
    tableName: "controller_errors",
    target: ControllerError,
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        message: {
            type: "text"
        },
        controller_id: {
            type: "int",
            nullable: false
        }
    },
    relations: {
        controller: {
            target: "Controller",
            type: "one-to-one",
            joinColumn: {
                name: 'controller_id',
                referencedColumnName: 'id'
            },
            eager: true
        }
    }
});
