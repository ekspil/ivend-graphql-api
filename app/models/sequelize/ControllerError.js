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
        field: "error_time"
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
module.exports = ControllerError
