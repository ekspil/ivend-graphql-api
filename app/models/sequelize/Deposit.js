const Sequelize = require("sequelize")

const Controller = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    }
}

module.exports = Controller
