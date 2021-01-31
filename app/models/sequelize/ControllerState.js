const Sequelize = require("sequelize")

const ControllerState = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    coinAcceptorStatus: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "coin_acceptor_status"
    },
    billAcceptorStatus: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "bill_acceptor_status"
    },
    coinAmount: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        field: "coin_amount"
    },
    billAmount: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        field: "bill_amount"
    },
    attentionRequired: {
        type: Sequelize.DataTypes.BOOLEAN,
        field: "attention_required"
    },
    dex1Status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "dex1_status"
    },
    dex2Status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "dex2_status"
    },
    exeStatus: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "exe_status"
    },
    mdbStatus: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "mdb_status"
    },
    signalStrength:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "signal_strength"
    },
    registrationTime: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        field: "registration_time"
    },
    controller_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        field: "controller_id"
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
module.exports = ControllerState
