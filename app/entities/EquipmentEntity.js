const {EntitySchema} = require("typeorm")

const Equipment = require("../models/Equipment")

module.exports = new EntitySchema({
    name: `Equipment`,
    tableName: `equipments`,
    target: Equipment,
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
