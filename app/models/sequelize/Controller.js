const Sequelize = require("sequelize")

const Controller = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    uid: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    mode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    accessKey: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        field: "access_key"
    },
    firmwareId: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: "firmware_id"
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
    }
}

module.exports = Controller
