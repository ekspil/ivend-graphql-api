const Sequelize = require("sequelize")

const ButtonItem = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    buttonId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        field: "button_id"
    },
}
module.exports = ButtonItem
