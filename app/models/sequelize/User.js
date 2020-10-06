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
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
    },
    companyName: {
        type: Sequelize.DataTypes.TEXT
    },
    inn: {
        type: Sequelize.DataTypes.TEXT
    },
    role: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
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
module.exports = User
