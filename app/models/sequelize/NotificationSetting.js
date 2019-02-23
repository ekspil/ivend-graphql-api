const Sequelize = require("sequelize")

const Item = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true
    },
    sms: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true
    }
}
module.exports = Item
