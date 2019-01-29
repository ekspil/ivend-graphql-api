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
        name: {
            type: "varchar"
        },
        uid: {
            type: "varchar"
        },
        revision: {
            type: "int"
        },
        mode: {
            type: "varchar"
        },
        status: {
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
        },
        equipment: {
            target: "Equipment",
            type: "one-to-one",
            joinColumn: {
                name: "equipment_id",
                referencedColumnName: "id"
            },
            eager: true
        },
        fiscalRegistrar: {
            target: "FiscalRegistrar",
            type: "one-to-one",
            joinColumn: {
                name: "fiscal_registrar_id",
                referencedColumnName: "id"
            },
            eager: true
        },
        bankTerminal: {
            target: "BankTerminal",
            type: "one-to-one",
            joinColumn: {
                name: "bank_terminal_id",
                referencedColumnName: "id"
            },
            eager: true
        }
    }
})
