const { EntitySchema } = require("typeorm")

const Role = require("../models/Role")

module.exports = new EntitySchema({
    name: "Role",
    tableName: "roles",
    target: Role,
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        name: {
            type: "varchar",
            unique: true
        }
    }
})
