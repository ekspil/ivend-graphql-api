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
    },
    billAcceptorStatus: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    coinAmount: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
    },
    billAmount: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
    },
    dex1Status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    dex2Status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    exeStatus: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    mdbStatus: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    signalStrength:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    registrationTime: {
        type: Sequelize.DataTypes.TIME,
        allowNull: false,
    },
    controller_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    }
}
module.exports = ControllerState
