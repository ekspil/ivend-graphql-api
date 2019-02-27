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
        allowNull: false,
        field: "idempotence_key"
    },
    to: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    paymentId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "payment_id"
    },
    redirectUrl: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "redirect_url"
    },
    status: {
        type: Sequelize.DataTypes.STRING,
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
    }
}

module.exports = PaymentRequest
