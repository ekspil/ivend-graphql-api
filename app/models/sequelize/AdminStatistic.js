const Sequelize = require("sequelize")


const Stat = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    billingAmount: {
        type: Sequelize.DataTypes.DECIMAL,
        field: "billing_amount"
    },
    billingBalance: {
        type: Sequelize.DataTypes.DECIMAL,
        field: "billing_balance"
    },
    billingCredit: {
        type: Sequelize.DataTypes.DECIMAL,
        field: "billing_credit"
    },
    controllersCount: {
        type: Sequelize.DataTypes.INTEGER,
        field: "controllers_count"
    },
    controllersDisabled: {
        type: Sequelize.DataTypes.INTEGER,
        field: "controllers_disabled"
    },
    controllersDisconnected: {
        type: Sequelize.DataTypes.INTEGER,
        field: "controllers_disconnected"
    },
    kktsCount: {
        type: Sequelize.DataTypes.INTEGER,
        field: "kkts_count"
    },
    kktsNormal: {
        type: Sequelize.DataTypes.INTEGER,
        field: "kkts_normal"
    },
    kktsError: {
        type: Sequelize.DataTypes.INTEGER,
        field: "kkts_error"
    },
    simCount: {
        type: Sequelize.DataTypes.INTEGER,
        field: "sim_count"
    },
    simExpense: {
        type: Sequelize.DataTypes.DECIMAL,
        field: "sim_expense"
    },
    simTraffic: {
        type: Sequelize.DataTypes.DECIMAL,
        field: "sim_traffic"
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
}

module.exports = Stat
