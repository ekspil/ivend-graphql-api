const Sequelize = require("sequelize")

const ControllerError = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
    },
    errorTime: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    }
}
module.exports = ControllerError
