const Sequelize = require("sequelize")

const Deposit = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false
    }
}

module.exports = Deposit
