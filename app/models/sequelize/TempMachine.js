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
    cashless: {
        type: Sequelize.DataTypes.DECIMAL,
    },
    count: {
        type: Sequelize.DataTypes.INTEGER,
    },
    countCashless: {
        type: Sequelize.DataTypes.INTEGER,
        field: "count_cashless"
    },
    meta: {
        type: Sequelize.DataTypes.STRING
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
