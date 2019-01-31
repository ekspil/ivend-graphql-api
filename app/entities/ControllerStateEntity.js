const {EntitySchema} = require("typeorm")

const ControllerState = require("../models/ControllerState")

module.exports = new EntitySchema({
    name: `ControllerState`,
    tableName: `controller_states`,
    target: ControllerState,
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        coinAcceptorStatus: {
            type: "varchar"
        },
        billAcceptorStatus: {
            type: "varchar"
        },
        coinAmount: {
            type: "decimal"
        },
        billAmount: {
            type: "decimal"
        },
        dex1Status: {
            type: "varchar"
        },
        dex2Status: {
            type: "varchar"
        },
        exeStatus: {
            type: "varchar"
        },
        mdbStatus: {
            type: "varchar"
        },
        signalStrength: {
            type: "varchar"
        },
        registrationTime: {
            type: "time"
        }
    },
    relations: {
        controller: {
            target: "Controller",
            type: "one-to-one",
            joinColumn: {
                name: "controller_id",
                referencedColumnName: "id"
            },
            eager: false
        }
    }
})
