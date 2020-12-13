const Sequelize = require("sequelize")
const FeeTransactions = {
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
    partnerId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "partner_id"
    },
    controllerFee: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        unique: false,
        field: "controller_fee"
    },
    terminalFee: {
        type: Sequelize.DataTypes.DECIMAL,
        unique: false,
        field: "terminal_fee"
    },
    kkmFee: {
        type: Sequelize.DataTypes.DECIMAL,
        unique: false,
        field: "kkm_fee"
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
module.exports = FeeTransactions
