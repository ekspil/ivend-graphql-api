const { EntitySchema } = require("typeorm")

const Permission = require("../models/Permission")

module.exports = new EntitySchema({
    name: "Permission",
    tableName: "permissions",
    target: Permission,
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
