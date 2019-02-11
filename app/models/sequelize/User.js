const Sequelize = require("sequelize")

const User = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
    },
    passwordHash: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
    },
    role: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
    }
}
module.exports = User
