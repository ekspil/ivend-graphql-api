const Sequelize = require("sequelize")

const PaymentRequest = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    idempotenceKey: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: "idempotence_key"
    },
    to: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
    },
    paymentId: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "payment_id"
    },
    redirectUrl: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "redirect_url"
    },
    status: {
        type: Sequelize.DataTypes.TEXT,
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
