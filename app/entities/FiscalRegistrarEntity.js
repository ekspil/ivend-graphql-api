const {EntitySchema} = require("typeorm")

const FiscalRegistrar = require("../models/FiscalRegistrar")

module.exports = new EntitySchema({
    name: `FiscalRegistrar`,
    tableName: `fiscal_registrars`,
    target: FiscalRegistrar,
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        name: {
            type: "varchar"
        }
    }
})
