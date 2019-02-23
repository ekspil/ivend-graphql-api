const Sequelize = require("sequelize")

const Transaction = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false
    },
    meta: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
}

module.exports = Transaction
