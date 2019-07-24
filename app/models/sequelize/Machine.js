const Sequelize = require("sequelize")

const Machine = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    number: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
    },
    name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
    },
    kktId: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true
    },
    place: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        unique: false,
        field: "created_at"
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        unique: false,
        field: "updated_at"
    },
    deletedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        unique: false,
        field: "deleted_at"
    }
}
module.exports = Machine
