const Sequelize = require("sequelize")

const BankPayment = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    applied: {
        type: Sequelize.DataTypes.BOOLEAN,
    },
    meta: {
        type: Sequelize.DataTypes.STRING,
    },
    userId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "user_id"
    },
    amount: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
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

module.exports = BankPayment
