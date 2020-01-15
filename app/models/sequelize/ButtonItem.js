const Sequelize = require("sequelize")

const ButtonItem = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    multiplier: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    buttonId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        field: "button_id"
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
module.exports = ButtonItem
