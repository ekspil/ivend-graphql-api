const Sequelize = require("sequelize")

const PaymentRequest = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    idempotenceKey: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    to: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    paymentId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    redirectUrl: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
}

module.exports = PaymentRequest