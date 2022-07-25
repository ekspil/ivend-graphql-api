const Sequelize = require("sequelize")

const ControllerIntegrations = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: "Vendista",
    },
    controllerUid: {
        type: Sequelize.DataTypes.TEXT,
        field: "controller_uid",
    },
    imei: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "imei"
    },
    serial: {
        type: Sequelize.DataTypes.TEXT,
        field: "serial"
    },
    controllerId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "controller_id"
    },
    userId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "user_id"
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
module.exports = ControllerIntegrations
