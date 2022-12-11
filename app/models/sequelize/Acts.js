const Sequelize = require("sequelize")

const Act = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    meta: {
        type: Sequelize.DataTypes.STRING
    },
    timestamp: {
        type: Sequelize.DataTypes.DATE
    },
    sum: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
    },
    userId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "user_id"
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
module.exports = Act
