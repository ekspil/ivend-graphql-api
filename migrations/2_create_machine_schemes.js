"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        // MachineType
        await queryInterface.createTable("machine_types", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            }
        })

        // MachineGroup
        await queryInterface.createTable("machine_groups", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "users",
                    key: "id"
                }
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
        })

        // Machine
        await queryInterface.createTable("machines", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            number: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            place: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            equipment_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "equipments",
                    key: "id"
                }
            },
            machine_group_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "machine_groups",
                    key: "id"
                }
            },
            machine_type_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "machine_types",
                    key: "id"
                }
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            }
        })
    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
