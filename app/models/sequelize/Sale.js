const Sequelize = require("sequelize")

const Sale = {
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
    }
}
module.exports = Sale
