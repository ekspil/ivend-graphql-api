const Sequelize = require("sequelize")

const Controller = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
    cashless: {
        type: Sequelize.DataTypes.TEXT
    },
    accessKey: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        field: "access_key"
    },
    simCardNumber: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        field: "sim_card_number"
    },
    readStatMode: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: "read_stat_mode"
    },
    bankTerminalMode: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: "bank_terminal_mode"
    },
    fiscalizationMode: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: "fiscalization_mode"
    },
    firmwareId: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: "firmware_id"
    },
    registrationTime: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: "registration_time"
    },
    connected: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false
    },
    remotePrinterId: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: "remote_printer_id"
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

module.exports = Controller
