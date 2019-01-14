const { EntitySchema } = require("typeorm")

const User = require("../models/User")

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    target: User,
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
    },
    relations: {
        role: {
            target: "Role",
            type: "one-to-one",
            joinColumn: {
                name: "role_id",
                referencedColumnName: "id"
            },
            eager: true,
            cascade: true
        }
    }
})
