const Sequelize = require("sequelize")

const Encashment = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    sum: {
        type: Sequelize.DataTypes.INTEGER,
    },
    meta: {
        type: Sequelize.DataTypes.STRING,
    },
    count: {
        type: Sequelize.DataTypes.INTEGER,
    },
    countCashless: {
        type: Sequelize.DataTypes.INTEGER,
        field: "count_cashless"
    },
    cashless: {
        type: Sequelize.DataTypes.DECIMAL,
    },
    //timestamp of encashment on controller side
    timestamp: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    },
    //timestamp of encashment on controller side
    prevEncashmentId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "prev_encashment_id",
        allowNull: true
    },
    //timestamp where entry created
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        unique: false,
        field: "created_at"
    }
}

module.exports = Encashment
