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
        unique: false
    },
    telegram: {
        type: Sequelize.DataTypes.STRING,
        unique: false
    },
    telegramChat: {
        type: Sequelize.DataTypes.STRING,
        unique: false
    },
    extraEmail: {
        type: Sequelize.DataTypes.STRING,
        unique: false
    },
    email: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true
    },
    sms: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true
    },
    tlgrm: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true
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
module.exports = Item
