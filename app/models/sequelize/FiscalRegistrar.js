const Sequelize = require("sequelize")

const FiscalRegistrar = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
}
module.exports = FiscalRegistrar

