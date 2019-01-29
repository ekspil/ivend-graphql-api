const {EntitySchema} = require("typeorm")

const BankTerminal = require("../models/BankTerminal")

module.exports = new EntitySchema({
    name: `BankTerminal`,
    tableName: `bank_terminals`,
    target: BankTerminal,
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
