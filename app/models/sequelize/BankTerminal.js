const Sequelize = require("sequelize")

const BankTerminal = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}
module.exports = BankTerminal
