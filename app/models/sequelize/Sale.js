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
    }
}

module.exports = Sale
