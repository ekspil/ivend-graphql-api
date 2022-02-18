const Sequelize = require("sequelize")

const Sim = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "user_id"
    },
    terminalId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "terminal_id"
    },
    userName: {
        type: Sequelize.DataTypes.TEXT,
        field: "user_name"
    },
    controllerId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "controller_id"
    },
    controllerUid: {
        type: Sequelize.DataTypes.STRING,
        field: "controller_uid"
    },
    number: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    terminal: {
        type: Sequelize.DataTypes.STRING,
    },
    phone: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    imsi: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    expense: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: true,
    },
    balance: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: true,
    },
    traffic: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: true,
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
module.exports = Sim
