const Sequelize = require("sequelize")

const Temp = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false
    },
    amountToday: {
        type: Sequelize.DataTypes.DECIMAL,
        field: "amount_today"
    },
    countToday: {
        type: Sequelize.DataTypes.INTEGER,
        field: "count_today"
    },
    countYesterday: {
        type: Sequelize.DataTypes.INTEGER,
        field: "count_yesterday"
    },
    amountYesterday: {
        type: Sequelize.DataTypes.DECIMAL,
        field: "amount_yesterday"
    },
    meta: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
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

module.exports = Temp
