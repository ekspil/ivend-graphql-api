const Sequelize = require("sequelize")

const Sale = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false
    },
    // external id from fiscal microservice (string)
    receiptId: {
        type: Sequelize.DataTypes.TEXT,
        field: "receipt_id",
        allowNull: true
    },    // external id from fiscal microservice (string)
    kktId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "kkt_id",
        allowNull: true
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

module.exports = Sale
